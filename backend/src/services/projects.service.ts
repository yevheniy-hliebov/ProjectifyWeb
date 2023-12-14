import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../schemas/project.schema';
import { ProjectData } from 'src/interfaces/project.interface';
import slugify from 'slugify';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private readonly projectModel: Model<Project>) { }

  async create(projectData: ProjectData): Promise<Project> {
    const { name, description } = projectData;

    if (!name) {
      throw new HttpException('Project name cannot be null or undefined', 400);
    }

    const slugName = this.nameSlugify(name)
    const existingProject = await this.projectModel.findOne({ slug: slugName }).exec();
    const hasSlugConflict = existingProject;
    this.ProjectValidation(name, hasSlugConflict, description);

    projectData.slug = slugName;
    const savedProject = await this.projectModel.create(projectData);

    return await this.projectModel.findById(savedProject._id).select({ _id: 0, __v: 0 }).exec();
  }


  async findOne(name: string): Promise<Project> {
    const project = await this.projectModel.findOne({ name }).select({ _id: 0, __v: 0 }).exec()
    if (!project) {
      throw new HttpException('Project not found', 404);
    }
    return project;
  }

  async findBySlug(slug: string): Promise<Project> {
    const project = await this.projectModel.findOne({ slug }).select({ _id: 0, __v: 0 }).exec()
    if (!project) {
      throw new HttpException('Project not found', 404);
    }
    return project;
  }

  async findIdBySlug(slug: string): Promise<string> {
    const project = await this.projectModel.findOne({ slug }).exec()
    if (!project) {
      throw new HttpException('Project not found', 404);
    }
    return project._id.toString();
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectModel.findById(id).exec()
    if (!project) {
      throw new HttpException('Project not found', 404);
    }
    return project;
  }

  async findAll(sortBy?: string, searchText?: string): Promise<Project[]> {
    let searchQuery = {}

    if (searchText) {
      const searchRegex = new RegExp(searchText, 'i'); // 'i' for case-insensitive search
      searchQuery = {
        $or: [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } }
        ]
      }
    }


    let sortQuery = {};
    if (sortBy) {
      switch (sortBy) {
        case 'newest': sortQuery = { created_at: -1 }; break;
        case 'oldest': sortQuery = { created_at: 1 }; break;
        case 'alphabetical': sortQuery = { name: 1 }; break;
        case 'reverseAlphabetical': sortQuery = { name: -1 }; break;
        default: break;
      }
    }
    
    const projects = await this.projectModel.find(searchQuery).sort(sortQuery).select({ _id: 0, __v: 0 }).exec()
    if (projects.length < 1) {
      throw new HttpException('Projects not found', 404);
    }
    return projects;
  }

  async update(id: string, oldSlug: string, projectData: ProjectData) {
    const { name, description } = projectData;

    if (!name) {
      throw new HttpException('Project name cannot be null or undefined', 400);
    }

    const slugName = this.nameSlugify(name)
    const existingProject = await this.projectModel.findOne({ slug: slugName }).exec();
    const hasSlugConflict = oldSlug !== slugName && existingProject;
    this.ProjectValidation(name, hasSlugConflict, description);

    if (oldSlug !== slugName) projectData.slug = slugName;
    projectData.updated_at = new Date();
    return await this.projectModel
      .findByIdAndUpdate(id, projectData, { new: true, select: { _id: 0, __v: 0 } })
      .exec();
  }

  async delete(id: string) {
    const project = await this.projectModel.findByIdAndDelete(id).select({ _id: 0, __v: 0 }).exec()
    if (!project) {
      throw new HttpException('Project not found', 404);
    }
    return project;
  }

  private ProjectValidation(name: string, isExistingProject, description: string) {
    const errors = [];
    let error = {
      field: '',
      message: ''
    }

    if (isExistingProject) {
      error.field = 'name';
      error.message = 'A project with this slug already exists';
      errors.push(error);
    }
    if (name.length < 3) {
      error.field = 'name';
      error.message = 'The name of the project is less than 3 characters';
      errors.push(error);
    }
    if (name.length > 50) {
      error.field = 'name';
      error.message = 'The name of the project is longer than 50 characters';
      errors.push(error);
    }
    if (name.length === 0 || name === null || name === undefined) {
      error.field = 'name';
      error.message = 'The name of the project is required';
      errors.push(error);
    }
    if (description.length > 1500) {
      error.field = 'description';
      error.message = 'The description of the project is longer than 1500 characters';
      errors.push(error);
    }
    
    if (errors.length > 0)
      throw new HttpException({errors}, 400);
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