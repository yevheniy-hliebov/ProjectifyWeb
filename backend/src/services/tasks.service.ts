import * as fs from 'fs';
import { extname } from 'path';
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Task, TaskDocument } from "../schemas/task.schema";
import { Model } from "mongoose";
import { TaskDto } from "../types/task.type";
import { InjectModel } from "@nestjs/mongoose";
import { HttpExceptionErrors } from "../customs.exception";
import { FindAllOptions } from "../types/find-all-options.type";
import { TaskValidation } from "../validation/task.validation";
import { FileDto } from '../types/file.type';
import { validationImage } from '../validation/image.validation';
import { ConfigService } from '@nestjs/config';
import getMimeType from '../functions/get-mimetype.function';
import createDirectory from '../functions/create-directory.function';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>, private readonly config: ConfigService) { }
  private readonly logger = new Logger(TasksService.name)

  private readonly storage: string = this.config.get<string>('storage_root') + 'tasks/covers/';
  private readonly allowedExtensions = this.config.get<string>('allowed_extensions_cover_images');
  private readonly maxImageSize = this.config.get<number>('max_image_size');

  async findAll(options: FindAllOptions) {
    let { skip, limit, sort, search, filter, select } = options;

    skip = skip !== undefined ? skip : 0;
    limit = limit !== undefined ? limit : 0;
    filter = filter !== undefined ? filter : {};
    select = select !== undefined ? select : {
      _id: 0, user_id: 0, __v: 0, project_id: 0, cover: 0
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
            { name: { $regex: searchRegex } }
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

    try {
      const tasks = await this.taskModel.find(filterQuery).sort(sortQuery).skip(skip).limit(limit).select(select).exec()
      const countProjects = await this.taskModel.countDocuments(filterQuery);
      const pagesCount = Math.ceil(countProjects / limit);
      this.logger.log(`Get tasks [count=${tasks.length}] ${this.objectToString(filter)} | page: ${skip / limit + 1}, limit: ${limit}`);
      return { count: tasks.length, tasks, page: skip / limit + 1, pages_count: pagesCount };
    } catch (err) {
      this.logger.error(`Failed to find tasks`, err);
      throw new HttpException('Failed to find tasks', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(filter: object, select = { _id: 0, __v: 0, user_id: 0, project_id: 0, cover: 0 }): Promise<TaskDocument> {
    const task = await this.taskModel.findOne(filter).select(select).exec()
    if (!task) {
      this.logger.error(`Failed to read task: Task with ${this.objectToString(filter)} does not exist`);
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Read task with ${this.objectToString(filter)}`);
    return task;
  }

  async findId(filter: object): Promise<string> {
    const task = await this.taskModel.findOne(filter).select({ _id: 1 }).exec()
    if (!task) {
      this.logger.error(`Failed to get id of task: Task with ${this.objectToString(filter)} does not exist`);
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Get id task: ${task.id}`);
    return task._id.toString();
  }

  async create(taskDto: TaskDto, select = { _id: 0, __v: 0, user_id: 0, project_id: 0, cover: 0 }): Promise<TaskDocument> {
    const errors = TaskValidation(taskDto);
    if (errors !== undefined) {
      this.logger.error(`Failed to create task: validation failed`, `TaskDto: ${this.objectToString(taskDto)}`, `Errors: ${this.objectToString(errors)}`)
      throw new HttpExceptionErrors('Task validation failed', HttpStatus.BAD_REQUEST, errors);
    }

    const tasks = await this.taskModel.find({ project_id: taskDto.project_id }).sort({ number: -1 }).select({ number: 1 }).exec();
    const maxNumber = tasks.length === 0 ? null : tasks[0].number;
    taskDto.number = maxNumber === null ? 1 : maxNumber + 1;

    if ('start_date' in taskDto && taskDto.start_date !== '') taskDto.start_date = this.convertDateStringToDate(taskDto.start_date)
    if ('end_date' in taskDto && taskDto.end_date !== '') taskDto.end_date = this.convertDateStringToDate(taskDto.end_date)

    if ('status' in taskDto) {
      const validStatuses = ['Not started', 'In progress', 'Done'];
      validStatuses.forEach((validStatus, i) => {
        if (validStatus.toLowerCase() === taskDto.status.toLowerCase()) {
          taskDto.status = validStatus[i];
        }
      });
    }
    if ('priority' in taskDto) {
      const validPriorities = ['Low', 'Medium', 'High'];
      validPriorities.forEach((validPriority, i) => {
        if (validPriority.toLowerCase() === taskDto.priority.toLowerCase()) {
          taskDto.priority = validPriority[i];
        }
      });
    }

    try {
      const createdTask = await this.taskModel.create(taskDto);
      this.logger.log(`Created task with id '${createdTask.id}'. TaskDto '${this.objectToString(taskDto)}`);
      return await this.taskModel.findById(createdTask._id).select(select).exec();
    } catch (err) {
      this.logger.error(`Failed to create task. CreatedTaskDto ${this.objectToString(taskDto)}`, err);
      throw new HttpException('Failed to create task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, taskDto: TaskDto, select = { _id: 0, __v: 0, user_id: 0, project_id: 0, cover: 0 }): Promise<TaskDocument> {
    const errors = TaskValidation(taskDto, 'update');
    if (errors !== undefined) {
      this.logger.error(`Failed to update task: validation failed`, `UpdateTaskDto: ${this.objectToString(taskDto)}`, `Errors: ${this.objectToString(errors)}`)
      throw new HttpExceptionErrors('Task validation failed', HttpStatus.BAD_REQUEST, errors);
    }

    if ('start_date' in taskDto) taskDto.start_date = this.convertDateStringToDate(taskDto.start_date)
    if ('end_date' in taskDto) taskDto.end_date = this.convertDateStringToDate(taskDto.end_date)

    if ('status' in taskDto) {
      const validStatuses = ['Not started', 'In progress', 'Done'];
      validStatuses.forEach((validStatus, i) => {
        if (validStatus.toLowerCase() === taskDto.status.toLowerCase()) {
          taskDto.status = validStatuses[i];
        }
      });
    }
    if ('priority' in taskDto) {
      const validPriorities = ['Low', 'Medium', 'High'];
      validPriorities.forEach((validPriority, i) => {
        if (validPriority.toLowerCase() === taskDto.priority.toLowerCase()) {
          taskDto.priority = validPriorities[i];
        }
      });
    }

    try {
      const updateTask = await this.taskModel.findByIdAndUpdate(id, taskDto, { new: true }).select(select).exec();
      this.logger.log(`Updated task with id '${id}'. UpdateTaskDto: ${this.objectToString(taskDto)}`);
      return updateTask;
    } catch (err) {
      this.logger.error(`Failed to update task. UpdateTaskDto: ${this.objectToString(taskDto)}`, err);
      throw new HttpException('Project not updated', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string, select = { _id: 0, __v: 0, user_id: 0, project_id: 0 }) {
    let deletedTask: TaskDocument;
    try {
      deletedTask = Object(await this.taskModel.findByIdAndDelete(id).select({ _id: 0, user_id: 0, __v: 0 }));
      this.logger.log(`Deleted task with id '${id}'`);
    } catch (err) {
      this.logger.error(`Failed to delete task '${id}'`, err);
      throw new HttpException('Failed to delete project', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (deletedTask?.cover !== '') {
      try {
        await fs.promises.unlink(this.storage + deletedTask.cover)
        this.logger.log(`Task [id: ${id}] cover deleted in storage successfully: ${deletedTask.cover}`);
      } catch (err) {
        this.logger.error(`Error deleting task [id: ${id}] cover in storage: `, err);
      }
    }

    if (deletedTask) {
      const tasks = await this.taskModel.find({ project_id: deletedTask.project_id }).sort({ number: -1 }).select({ _id: 1, number: 1 }).exec();
      if (tasks.length > 0) {
        let i = 1;
        tasks.forEach(async (task) => {
          try {
            await this.taskModel.updateOne({ _id: task._id, project_id: deletedTask.project_id }, { number: i })
            this.logger.log(`Renumber task '${task.id}' to number ${i}`);
          } catch (err) {
            console.log(err);
            this.logger.error(`Failed to renumber task '${task.id}'`, err);
          }
          i = i + 1
        });
      }
    }
    return deletedTask;
  }

  async getCover(id: string) {
    const coverFilename = (await this.taskModel.findById(id).select({ cover: 1 }))?.cover;
    if (coverFilename === '') {
      this.logger.error(`Error get task [id: ${id}] cover: Task not have cover`);
      throw new HttpException('Task not have cover', HttpStatus.NOT_FOUND);
    }
    try {
      const coverBuffer = fs.readFileSync(this.storage + coverFilename);
      this.logger.log(`Get task [id: ${id}] cover: ${coverFilename}`);
      let mimetype = getMimeType(extname(coverFilename).replace('.', ''))
      return { buffer: coverBuffer, filename: coverFilename, mimetype: mimetype };
    } catch (error) {
      this.logger.error(`Error get task [id: ${id}] cover: Task not have cover in storage`);
      throw new HttpException('Task cover not found', HttpStatus.NOT_FOUND)
    }
  }

  async uploadCover(id: string, file: FileDto) {
    const errors = validationImage(file, { extensions: this.allowedExtensions, maxImageSize: this.maxImageSize })
    console.log(this.allowedExtensions);

    if (errors) {
      this.logger.error(`Error upload task [id: ${id}] cover: Image validation failed`, 'Error: ' + this.objectToString(errors));
      throw new HttpExceptionErrors('Image validation failed', HttpStatus.BAD_REQUEST, errors)
    }

    const filename = `${id}-${Date.now()}-${Math.floor(Math.random() * 999999)}${extname(file.originalname)}`
    const oldfilename = (await this.taskModel.findById(id).select({ cover: 1 }).exec())?.cover;

    try {
      await Promise.all([
        await createDirectory(this.storage),
        await fs.promises.writeFile(this.storage + filename, file.buffer, {
          encoding: 'utf-8',
        }),
        await this.taskModel.findByIdAndUpdate(id, { cover: filename }).exec()
      ])
      this.logger.log(`Task [id: ${id}] cover uploaded successfully: ${filename}`);
      if (oldfilename !== '') {
        try {
          await fs.promises.unlink(this.storage + oldfilename);
          this.logger.log(`Old task [id: ${id}] cover deleted successfully: ${oldfilename}`);
        } catch (err) {
          this.logger.error(`Error deleting task [id: ${id}] cover: `, err);
        }
      }
    } catch (err) {
      this.logger.error(`Error uploading task [id: ${id}] cover: `, err);
      throw new HttpException('Failed to upload cover', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return filename;
  }

  async deleteCover(id: string) {
    const deletefilename = (await this.taskModel.findById(id).select({ cover: 1 }).exec())?.cover;
    if (deletefilename !== '') {
      try {
        await Promise.all([
          await this.taskModel.findByIdAndUpdate(id, { cover: '' }).exec(),
          await fs.promises.unlink(this.storage + deletefilename)
        ])
        this.logger.log(`Task [id: ${id}] cover deleted successfully: ${deletefilename}`);
      } catch (err) {
        this.logger.error(`Error deleting task [id: ${id}] cover: `, err);
        throw new HttpException('Failed to deleting cover', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  private convertDateStringToDate(dateString: string) {
    const exceptionsWords = ['today', 'tomorrow']
    if (exceptionsWords.includes(dateString)) {
      const now = new Date();
      if (dateString === 'today') {
        return `${now.getFullYear()}-${now.getMonth()}-${now.getDate() + 1}`
      } else if (dateString === 'tomorrow') {
        return `${now.getFullYear()}-${now.getMonth()}-${now.getDate() + 2}`
      }
    }
    return dateString;
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
};
