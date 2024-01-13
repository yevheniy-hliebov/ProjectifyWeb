import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Task, TaskDocument } from "../schemas/task.schema";
import { Model } from "mongoose";
import { TaskDto } from "../types/task.type";
import { InjectModel } from "@nestjs/mongoose";
import { HttpExceptionErrors } from "../customs.exception";
import { FindAllOptions } from "../types/find-all-options.type";
import { TaskValidation } from "src/validation/task.validation";

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) { }
  private readonly logger = new Logger(TasksService.name)

  async findAll(options: FindAllOptions) {
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

    const tasks = await this.taskModel.find(filterQuery).sort(sortQuery).skip(skip).limit(limit).select(select).exec()
    const countProjects = await this.taskModel.countDocuments(filterQuery);
    const pagesCount = Math.ceil(countProjects / limit);
    this.logger.log(`Get tasks [count=${tasks.length}] ${this.objectToString(filter)} | page: ${skip / limit + 1}, limit: ${limit}`);
    return { count: tasks.length, tasks, page: skip / limit + 1, pages_count: pagesCount };
  }

  async findOne(filter: object, select = { _id: 0, __v: 0, user_id: 0, project_id: 0 }): Promise<TaskDocument> {
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

  async create(taskDto: TaskDto, select = { _id: 0, __v: 0, user_id: 0, project_id: 0 }): Promise<TaskDocument> {
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

    const createdTask = await this.taskModel.create(taskDto);
    if (!createdTask) {
      this.logger.error(`Failed to create task: Mongo not created the task. TaskDto '${this.objectToString(taskDto)}'`);
      throw new HttpException('Failed to create task: Mongo not created the task', HttpStatus.BAD_REQUEST);
    }
    this.logger.log(`Created task with id '${createdTask.id}'. TaskDto '${this.objectToString(taskDto)}`);
    return await this.taskModel.findById(createdTask._id).select(select).exec();
  }

  async update(id: string, taskDto: TaskDto, select = { _id: 0, __v: 0, user_id: 0, project_id: 0 }): Promise<TaskDocument> {
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

    const updateTask = await this.taskModel.findByIdAndUpdate(id, taskDto, { new: true }).select(select).exec();
    if (!updateTask) {
      this.logger.error(`Failed to update task: Mongo not updated the task. UpdateTaskDto: ${this.objectToString(taskDto)}`);
      throw new HttpException('Project not created', HttpStatus.BAD_REQUEST);
    }
    this.logger.log(`Updated task with id '${id}'. UpdateTaskDto: ${this.objectToString(taskDto)}`);
    return updateTask;
  }

  async delete(id: string, select = { _id: 0, __v: 0, user_id: 0, project_id: 0 }) {
    const deletedTask: TaskDocument = Object(await this.taskModel.findByIdAndDelete(id));
    if (deletedTask) {
      const tasks = await this.taskModel.find({ project_id: deletedTask.project_id }).sort({ number: -1 }).select({ number: 1 }).exec();
      let i = 1;
      tasks.forEach((task) => {
        this.taskModel.findByIdAndDelete(task._id, { number: i })
        i = i + 1
      });
    }
    return deletedTask;
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
