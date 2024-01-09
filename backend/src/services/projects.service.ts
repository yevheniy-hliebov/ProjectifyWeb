import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { ProjectData } from '../interfaces/project.interface';
import slugify from 'slugify';
import { HttpExceptionErrors } from '../customs.exception';
import { TasksService } from './tasks.service';
import { Task, TaskDocument } from 'src/schemas/task.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  private readonly logger = new Logger(ProjectsService.name)
  
  async create(projectData: ProjectData): Promise<ProjectDocument> {
    const { name, description } = projectData;
    
    if (!name) {
      this.logger.error('Failed to create project: Project name cannot be null or undefined');
      throw new HttpException('Project name cannot be null or undefined', HttpStatus.BAD_REQUEST);
    }
    
    const slugName = this.nameSlugify(name)
    const existingProject = await this.projectModel.findOne({ slug: slugName }).exec();
    const hasSlugConflict = existingProject;
    this.ProjectValidation(name, hasSlugConflict, description);
    
    projectData.slug = slugName;
    const savedProject = await this.projectModel.create(projectData);
    if (!savedProject) {
      this.logger.error(`Failed to create project: Mongo not create the project '${name}'`);
      throw new HttpException('Project not created', HttpStatus.BAD_REQUEST);
    }
    this.logger.log(`Created project with id '${savedProject.id}'`);
    return await this.projectModel.findById(savedProject._id).select({ _id: 0, user_id: 0, __v: 0 }).exec();
  }
  
  
  async findOne(name: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findOne({ name }).select({ _id: 0, __v: 0 }).exec()
    if (!project) {
      this.logger.log(`Failed to read project: Project with name '${name}' does not exist`);
      throw new HttpException("Projects not found", HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Read project with name '${name}'`);
    return project;
  }
  
  async findBySlug(slug: string, user_id: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findOne({ slug, user_id }).select({ _id: 0, user_id: 0, __v: 0 }).exec()
    if (!project) {
      this.logger.log(`Failed to read project: Project with slug '${slug}' and user_id '${user_id}' does not exist`);
      throw new HttpException("Projects not found", HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Read project with slug '${slug}' and user_id '${user_id}'`);
    return project;
  }
  
  async findIdBySlug(slug: string, user_id: string): Promise<string> {
    const project = await this.projectModel.findOne({ slug, user_id }).exec()
    if (!project) {
      this.logger.log(`Failed to get id project: Project with slug '${slug}' and user_id '${user_id}' does not exist`);
      throw new HttpException("Projects not found", HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Get id project with slug '${slug}' and user_id '${user_id}'`);
    return project._id.toString();
  }
  
  async findById(id: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(id).exec()
    if (!project) {
      this.logger.log(`Failed to read project: Project with id '${id}' does not exist`);
      throw new HttpException("Projects not found", HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Read project with id '${id}'`);
    return project;
  }
  
  async findAll(user_id: string, sortBy?: string, searchText?: string, skip?: number, limit?: number) {
    let searchQuery: any = { user_id };
    
    if (searchText) {
      const searchRegex = new RegExp(searchText, 'i'); // 'i' for case-insensitive search
      searchQuery.$or = [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } }
      ]
    }
    
    
    let sortQuery = {};
    if (sortBy) {
      switch (sortBy) {
        case 'newest': sortQuery = { createdAt: -1 }; break;
        case 'oldest': sortQuery = { createdAt: 1 }; break;
        case 'alphabetical': sortQuery = { name: 1 }; break;
        case 'reverseAlphabetical': sortQuery = { name: -1 }; break;
        default: break;
      }
    }
    
    const projects = await this.projectModel.find(searchQuery).sort(sortQuery).skip(skip).limit(limit).select({ _id: 0, user_id: 0, __v: 0 }).exec()
    const countProjects = await this.projectModel.countDocuments(searchQuery);
    const countPages = Math.round(countProjects / limit);
    this.logger.log(`Get projects [count=${projects.length}] with user_id '${user_id}', page: ${skip / limit + 1}, limit: ${limit}`);
    return { count: projects.length, projects, page: skip / limit + 1, count_pages: countPages };
  }

  async update(id: string, oldSlug: string, projectData: ProjectData) {
    const { name, description } = projectData;

    if (!name) {
      this.logger.error('Failed to update project: Project name cannot be null or undefined');
      throw new HttpException('Project name cannot be null or undefined', HttpStatus.BAD_REQUEST);
    }

    const slugName = this.nameSlugify(name)
    const existingProject = await this.projectModel.findOne({ slug: slugName }).exec();
    const hasSlugConflict = oldSlug !== slugName && existingProject;
    this.ProjectValidation(name, hasSlugConflict, description);

    if (oldSlug !== slugName) projectData.slug = slugName;
    const updatedProject = await this.projectModel
    .findByIdAndUpdate(id, projectData, { new: true, select: { _id: 0, user_id: 0, __v: 0 } })
    .exec();

    if (!updatedProject) {
      this.logger.error(`Failed to update project: Mongo not updated the project with '${id}'`);
      throw new HttpException('Project not updated', HttpStatus.BAD_REQUEST);
    }
    this.logger.log(`Updated project with id '${id}'`);
    return updatedProject;
  }
  
  async delete(id: string) {
    const project = await this.projectModel.findByIdAndDelete(id).select({ _id: 0, user_id: 0, __v: 0 }).exec()
    if (!project) {
      this.logger.error(`Failed to delete project: Mongo not deleted the project with '${id}'`);
      throw new HttpException('Project not found', 404);
    }
    const deleteTasksResult = await this.taskModel.deleteMany({project_id: id});
    this.logger.log(`Deleted project with id '${id}'${deleteTasksResult.deletedCount > 0 ? ` and deleted ${deleteTasksResult.deletedCount} tasks` : ''}`);
    return project;
  }
  
  async getCountPages(user_id: string, limit: number) {
    const countProjects = await this.projectModel.countDocuments({user_id});
    const countPages = Math.round(countProjects / limit);
    this.logger.log(`Get the number of pages in table project with user_id ${user_id} - pages_count: ${countPages}, limit ${limit}`);
    return countPages;
  }

  private ProjectValidation(name: string, isExistingProject, description: string) {
    const errors: Record<string, string> = {};

    if (isExistingProject) {
      errors.name = 'A project with this slug already exists';
    }
    if (name.length < 3) {
      errors.name = 'The name of the project is less than 3 characters';
    }
    if (name.length > 50) {
      errors.name = 'The name of the project is longer than 50 characters';
    }
    if (name.length === 0 || name === null || name === undefined) {
      errors.name = 'The name of the project is required';
    }
    if (description.length > 1500) {
      errors.description = 'The description of the project is longer than 1500 characters';
    }

    if (Object.keys(errors).length > 0) {
      this.logger.error(`Project validation failed`, `name: ${name}, description: ${description}`, errors)
      throw new HttpExceptionErrors('Project validation failed', HttpStatus.BAD_REQUEST, errors);
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
}