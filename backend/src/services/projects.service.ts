import * as fs from 'fs';
import { extname } from 'path';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { ProjectDto } from '../types/project.type';
import { HttpExceptionErrors } from '../customs.exception';
import { Task, TaskDocument } from '../schemas/task.schema';
import { FindAllOptions } from '../types/find-all-options.type';
import { ProjectValidation } from '../validation/project.validation';
import { FileDto } from '../types/file.type';
import { validationImage } from '../validation/image.validation';
import { ConfigService } from '@nestjs/config';
import getMimeType from '../functions/get-mimetype.function';
import createDirectory from 'src/functions/create-directory.function';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    private readonly config: ConfigService,
  ) { }

  private readonly logger = new Logger(ProjectsService.name);

  private readonly storage: string = this.config.get<string>('storage_root') + 'projects/covers/';
  private readonly allowedExtensions = this.config.get<string[]>('allowed_extensions_cover_images');
  private readonly maxFileSize = this.config.get<number>('storage_max_file_size');

  async findAll(options: FindAllOptions): Promise<{ count: number, projects: ProjectDocument[], page: number, pages_count: number }> {
    let { skip, limit, sort, search, filter, select } = options;

    skip = skip !== undefined ? skip : 0;
    limit = limit !== undefined ? limit : 0;
    filter = filter !== undefined ? filter : {};
    select = select !== undefined ? select : {
      _id: 0, user_id: 0, __v: 0
    }

    let filterQuery: any = filter;
    if (search !== undefined && 'searchText' in search) {
      if (search.searchText && search.searchText != '') {
        const searchRegex = new RegExp(search.searchText, 'i'); // 'i' for case-insensitive search
        if ('fields' in search) {
          const orList = []
          search.fields.forEach(field => {
            orList.push({ [field]: { $regex: searchRegex } })
          });
          filterQuery.$or = orList;
        } else {
          filterQuery.$or = [
            { name: { $regex: searchRegex } },
            { description: { $regex: searchRegex } }
          ]
        }
      }
    }

    let sortQuery = {};
    if (sort) {
      switch (sort) {
        case 'newest': sortQuery = { createdAt: -1 }; break;
        case 'oldest': sortQuery = { createdAt: 1 }; break;
        case 'alphabetical': sortQuery = { name: 1 }; break;
        case 'reverseAlphabetical': sortQuery = { name: -1 }; break;
        default: break;
      }
    }
    const projects = await this.projectModel.find(filterQuery).sort(sortQuery).skip(skip).limit(limit).select(select).exec()
    const countProjects = await this.projectModel.countDocuments(filterQuery);
    const pagesCount = Math.ceil(countProjects / limit);
    this.logger.log(`Get projects [count=${projects.length}] ${this.objectToString(filter)} | page: ${skip / limit + 1}, limit: ${limit}`);
    return { count: projects.length, projects, page: skip / limit + 1, pages_count: pagesCount };
  }

  async findOne(filter: object, select = { _id: 0, __v: 0, user_id: 0 }): Promise<ProjectDocument> {
    const project = await this.projectModel.findOne(filter).select(select).exec()
    if (!project) {
      this.logger.error(`Failed to read project: Project with ${this.objectToString(filter)} does not exist`);
      throw new HttpException("Project not found", HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Read project with name '${project.name}'`);
    return project;
  }

  async findId(filter: object): Promise<string> {
    const project = await this.projectModel.findOne(filter).select({ _id: 1 }).exec()
    if (!project) {
      this.logger.error(`Failed to get id of project: Project with ${this.objectToString(filter)} does not exist`);
      throw new HttpException("Project not found", HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Get id project: ${project.id}`);
    return project._id.toString();
  }

  async findById(id: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(id).exec()
    if (!project) {
      this.logger.error(`Failed to read project: Project with id '${id}' does not exist`);
      throw new HttpException("Project not found", HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Read project with id '${id}'`);
    return project;
  }

  async create(projectDto: ProjectDto): Promise<ProjectDocument> {
    const { name, user_id } = projectDto;

    if (!name) {
      this.logger.error('Failed to create project: Project name cannot be null or undefined');
      throw new HttpException('Project name cannot be null or undefined', HttpStatus.BAD_REQUEST);
    }

    const slugName = this.nameSlugify(name);
    const existingProject = await this.projectModel.findOne({ user_id: user_id, slug: slugName }).exec();

    const hasSlugConflict = existingProject !== null;
    const errors = ProjectValidation(projectDto, hasSlugConflict);
    if (errors !== undefined) {
      this.logger.error(`Failed to create project: validation failed`, `ProjectDto: ${this.objectToString(projectDto)}`, `Errors: ${this.objectToString(errors)}`)
      throw new HttpExceptionErrors('Project validation failed', HttpStatus.BAD_REQUEST, errors);
    }

    projectDto.slug = slugName;
    const savedProject = await this.projectModel.create(projectDto);
    if (!savedProject) {
      this.logger.error(`Failed to create project: Mongo not create the project. ProjectDto: ${this.objectToString(projectDto)}`);
      throw new HttpException('Project not created', HttpStatus.BAD_REQUEST);
    }
    this.logger.log(`Created project with id '${savedProject.id}'. ProjectDto: ${this.objectToString(projectDto)}`);
    return await this.projectModel.findById(savedProject._id).select({ _id: 0, user_id: 0, __v: 0 }).exec();
  }

  async update(id: string, projectDto: ProjectDto) {
    const { user_id } = projectDto;
    let slugName = undefined;
    if ('name' in projectDto) {
      slugName = this.nameSlugify(projectDto.name)
    }
    if ('slug' in projectDto) {
      slugName = this.nameSlugify(projectDto.slug)
    }
    let hasSlugConflict = false;
    if (slugName !== undefined) {
      const existingProject = await this.projectModel.findOne({ user_id: user_id, slug: slugName }).select({ _id: 1 }).exec();
      if (existingProject) {
        hasSlugConflict = id !== existingProject.id;
      }
      console.log(user_id, slugName, existingProject, hasSlugConflict, id === existingProject.id);
    }
    const errors = ProjectValidation(projectDto, hasSlugConflict, 'update');
    if (errors !== undefined) {
      this.logger.error(`Failed to update project: validation failed`, `ProjectDto: ${this.objectToString(projectDto)}`, `Errors: ${this.objectToString(errors)}`)
      throw new HttpExceptionErrors('Project validation failed', HttpStatus.BAD_REQUEST, errors);
    }

    if (slugName !== undefined) {
      projectDto.slug = slugName;
    }
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, projectDto, { new: true, select: { _id: 0, user_id: 0, __v: 0 } })
      .exec();

    if (!updatedProject) {
      this.logger.error(`Failed to update project: Mongo not updated the project with '${id}'. ProjectDto '${this.objectToString(projectDto)}`);
      throw new HttpException('Project not updated', HttpStatus.BAD_REQUEST);
    }
    this.logger.log(`Updated project with id '${id}'. ProjectDto ${this.objectToString(projectDto)}`);
    return updatedProject;
  }

  async delete(id: string) {
    let deletedProject: ProjectDocument;
    try {
      deletedProject = Object(await this.projectModel.findByIdAndDelete(id).select({ _id: 0, user_id: 0, __v: 0 }).exec())
      this.logger.log(`Deleted project with id '${id}'`);
    } catch (err) {
      this.logger.error(`Failed to delete project '${id}'`, err);
      throw new HttpException('Failed to delete project', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (deletedProject?.cover !== '') {
      try {
        await fs.promises.unlink(this.storage + deletedProject.cover)
        this.logger.log(`Project [id: ${id}] cover deleted in storage successfully: ${deletedProject.cover}`);
      } catch (err) {
        this.logger.error(`Error deleting project [id: ${id}] cover in storage: `, err);
      }
    }
    
    let tasks = await this.taskModel.find({ project_id: id }).select({ _id: 1, cover: 1 }).exec();
    if (tasks.length > 0) {
      try {
        const deleteTasksResult = await this.taskModel.deleteMany({ project_id: id });
        this.logger.log(`Deleted [${deleteTasksResult.deletedCount}] tasks with project_id '${id}'`);
        if (deleteTasksResult.deletedCount > 0) {
          tasks.forEach((task, i) => {
            if (task.cover !== '') {
              try {
                fs.promises.unlink(this.storage + task.cover)
                this.logger.log(`Task [id: ${task.id}] cover deleted in storage successfully: ${task.cover}`);
              } catch (err) {
                this.logger.error(`Error deleting task [id: ${task.id}] cover in storage: `, err);
              }
            }
          });
        }
      } catch (err) {
        this.logger.log(`Deleted tasks with project_id '${id}'`, err);
      }
    }

    return deletedProject;
  }

  async getCountPages(filter: object, limit: number) {
    const countProjects = await this.projectModel.countDocuments(filter);
    const pagesCount = Math.ceil(countProjects / limit);
    this.logger.log(`Get the number of pages in table project with ${this.objectToString(filter)} - pages_count: ${pagesCount}, limit ${limit}`);
    return pagesCount;
  }

  async getCover(id: string) {
    const coverFilename = (await this.projectModel.findById(id).select({ cover: 1 }))?.cover;
    if (coverFilename === '') {
      this.logger.error(`Error get project [id: ${id}] cover: Project not have cover`);
      throw new HttpException('Project not have cover', HttpStatus.NO_CONTENT);
    }
    try {
      const coverBuffer = fs.readFileSync(this.storage + coverFilename);
      this.logger.log(`Get project [id: ${id}] cover: ${coverFilename}`);
      let mimetype = getMimeType(extname(coverFilename).replace('.', ''))
      return { buffer: coverBuffer, filename: coverFilename, mimetype: mimetype };
    } catch (error) {
      this.logger.error(`Error get project [id: ${id}] cover: Project not have cover in storage`);
      throw new HttpException('Project cover not found', HttpStatus.NOT_FOUND)
    }
  }

  async uploadCover(id: string, file: FileDto) {
    const errors = validationImage(file, this.allowedExtensions, this.maxFileSize)
    if (errors) {
      this.logger.error(`Error upload project [id: ${id}] cover: Image validation failed`, 'Error: ' + this.objectToString(errors));
      throw new HttpExceptionErrors('Image validation failed', HttpStatus.BAD_REQUEST, errors)
    }

    const filename = `${id}-${Date.now()}-${Math.floor(Math.random() * 999999)}${extname(file.originalname)}`
    const oldfilename = (await this.projectModel.findById(id).select({ cover: 1 }).exec())?.cover;

    try {
      await Promise.all([
        await createDirectory(this.storage),
        await fs.promises.writeFile(this.storage + filename, file.buffer, {
          encoding: 'utf-8',
        }),
        await this.projectModel.findByIdAndUpdate(id, { cover: filename }).exec()
      ])
      this.logger.log(`Project [id: ${id}] cover uploaded successfully: ${filename}`);
      if (oldfilename !== '') {
        try {
          await fs.promises.unlink(this.storage + oldfilename);
          this.logger.log(`Old project [id: ${id}] cover deleted successfully: ${oldfilename}`);
        } catch (err) {
          this.logger.error(`Error deleting project [id: ${id}] cover: `, err);
        }
      }
    } catch (err) {
      this.logger.error(`Error uploading project [id: ${id}] cover: `, err);
      throw new HttpException('Failed to upload cover', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return filename;
  }

  async deleteCover(id: string) {
    const deletefilename = (await this.projectModel.findById(id).select({ cover: 1 }).exec())?.cover;
    if (deletefilename !== '') {
      try {
        await Promise.all([
          await this.projectModel.findByIdAndUpdate(id, { cover: '' }).exec(),
          await fs.promises.unlink(this.storage + deletefilename)
        ])
        this.logger.log(`Project [id: ${id}] cover deleted successfully: ${deletefilename}`);
      } catch (err) {
        this.logger.error(`Error deleting project [id: ${id}] cover: `, err);
        throw new HttpException('Failed to deleting cover', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  private nameSlugify(name: string) {
    return slugify(name, {
      replacement: '-',  // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true,      // convert to lower case, defaults to `false`
      strict: false,     // strip special characters except replacement, defaults to `false`
      locale: 'vi',      // language code of the locale to use
      trim: true         // trim leading and trailing replacement chars, defaults to `true`
    })
  }

  private objectToString(obj: object): string {
    let text = ''
    Object.keys(obj).forEach((key, index) => {
      text += `${key} '${typeof obj[key] === 'object' ? JSON.stringify(obj[key]) : obj[key]}'`;
      if ((index !== Object.keys(obj).length - 1) && (index < Object.keys(obj).length - 1)) {
        text += ', ';
      }
    });
    return text;
  }
}