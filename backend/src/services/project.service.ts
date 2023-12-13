import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../schemas/project.schema';
import { ProjectData } from 'src/interfaces/project.interface';
import slugify from 'slugify';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Project.name) private readonly projectModel: Model<Project>) { }

  async create(projectData: ProjectData) {
    const { name, description } = projectData;

    const slugName = this.nameSlugify(name)

    const existingProject = await this.projectModel.findOne({ slug: slugName }).exec();
    const hasSlugConflict = existingProject;
    const validationError = this.ProjectValidation(name, hasSlugConflict, description);
    if (validationError) return validationError;

    projectData.slug = slugName;
    const savedProject = await this.projectModel.create(projectData);

    return await this.projectModel.findById(savedProject._id).select({ _id: 0, __v: 0 }).exec();
  }


  async findOne(name: string): Promise<Project> {
    return await this.projectModel.findOne({ name }).select({ _id: 0, __v: 0 }).exec()
  }

  async findBySlug(slug: string): Promise<Project> {
    return await this.projectModel.findOne({ slug }).select({ _id: 0, __v: 0 }).exec()
  }

  async findIdBySlug(slug: string): Promise<string> {
    const project = await this.projectModel.findOne({ slug }).exec()
    if (!project) {
      throw new ConflictException('Project not found');
    }
    return project._id.toString();
  }

  async findById(id: string): Promise<Project> {
    return await this.projectModel.findById(id).exec()
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

    return await this.projectModel.find(searchQuery).sort(sortQuery).select({ _id: 0, __v: 0 }).exec();
  }

  async update(id: string, oldSlug: string, projectData: ProjectData) {
    const { name, description } = projectData;
    const newSlug = this.nameSlugify(name);

    const existingProject = await this.projectModel.findOne({ slug: newSlug }).exec();
    const hasSlugConflict = oldSlug !== newSlug && existingProject;
    const validationError = this.ProjectValidation(name, hasSlugConflict, description);
    if (validationError) return validationError;
    
    if (oldSlug !== newSlug) projectData.slug = newSlug;
    projectData.updated_at = new Date();
    return await this.projectModel
      .findByIdAndUpdate(id, projectData, { new: true, select: { _id: 0, __v: 0 } })
      .exec();
  }

  async delete(id: string) {
    return await this.projectModel.findByIdAndDelete(id).select({ _id: 0, __v: 0 }).exec();
  }

  private ProjectValidation(name: string, isExistingProject, description: string) {
    const errors = {
      name: '',
      description: ''
    };

    if (isExistingProject) {
      errors['name'] = 'A project with this slug already exists';
    }
    if (name.length < 3) {
      errors['name'] = 'The name of the project is less than 3 characters';
    }
    if (name.length > 50) {
      errors['name'] = 'The name of the project is longer than 50 characters';
    }
    if (name.length === 0 || name === null || name === undefined) {
      errors['name'] = 'The name of the project is required';
    }
    if (description.length > 1500) {
      errors['description'] = 'The description of the project is longer than 1500 characters';
    }

    return (!errors.name && !errors.description) ? null : { error: errors };
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