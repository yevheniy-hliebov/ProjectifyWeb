import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Task, TaskDocument } from "../schemas/task.schema";
import { Model } from "mongoose";
import { TaskDto } from "src/interfaces/task.interface";
import { InjectModel } from "@nestjs/mongoose";
import { HttpExceptionErrors } from "src/customs.exception";

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) { }
  private readonly logger = new Logger(TasksService.name)

  async findAllInProject(user_id: string, project_id: string, sortBy?: string, searchText?: string, skip?: number, limit?: number) {
    let searchQuery: any = { user_id, project_id };

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
    const tasks = await this.taskModel.find(searchQuery).sort(sortQuery).skip(skip).limit(limit).select({ _id: 0, __v: 0, project_id: 0, user_id: 0}).exec();
    const countTasks = await this.taskModel.countDocuments(searchQuery);
    const pagesCount = Math.ceil(countTasks / limit);
    
    this.logger.log(`Get tasks [count=${tasks.length}] with user_id '${user_id}' and project_id '${project_id}', page: ${skip / limit + 1}, limit: ${limit}`);
    return { count: tasks.length, tasks, page: skip / limit + 1, pages_count: pagesCount };
  }
  
  async findByNumberAndProjectId(user_id: string, project_id: string, number: number): Promise<TaskDocument> {
    const task = await this.taskModel.findOne({user_id, number, project_id}).exec();
    if (!task) {
      this.logger.error(`Failed to read task: Task with number '${number}' and project_id '${project_id}', user_id '${user_id}' does not exist`);
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Get task with number '${number}' and project_id '${project_id}', user_id '${user_id}'`);
    return task;
  }

  async create(taskDto: TaskDto): Promise<TaskDocument> {
    this.TaskValidation(taskDto);
    
    const tasks = await this.taskModel.find({ project_id: taskDto.project_id }).sort({ number: -1 }).select({ number: 1 }).exec();
    const maxNumber = tasks.length === 0 ? null : tasks[0].number;   
    taskDto.number = maxNumber === null ? 1 : maxNumber + 1;
    
    if ('start_date' in taskDto && taskDto.start_date !== '') taskDto.start_date = this.convertDateStringToDate(taskDto.start_date)
    if ('end_date' in taskDto && taskDto.end_date !== '') taskDto.end_date = this.convertDateStringToDate(taskDto.end_date)
    const createdTask = await this.taskModel.create(taskDto);
    if (!createdTask) {
      this.logger.error(`Failed to create task: Mongo not created the task '${taskDto.name}'`);
      throw new HttpException('Project not created', HttpStatus.BAD_REQUEST);
    }
    this.logger.log(`Created task with id '${createdTask.id}'`);
    return await this.taskModel.findById(createdTask._id).select({ _id: 0, __v: 0, project_id: 0, user_id: 0}).exec();
  }

  async update(user_id: string, project_id: string , number: number, taskDto: TaskDto): Promise<TaskDocument> {
    this.TaskValidation(taskDto);
    if ('start_date' in taskDto) taskDto.start_date = this.convertDateStringToDate(taskDto.start_date)
    if ('end_date' in taskDto) taskDto.end_date = this.convertDateStringToDate(taskDto.end_date)

    const updateTask = await this.taskModel.findOneAndUpdate({user_id, number, project_id}, taskDto, {new: true}).select({ _id: 0, __v: 0, project_id: 0, user_id: 0}).exec();
    if (!updateTask) {
      this.logger.error(`Failed to update task: Mongo not updated the task '${taskDto.name}'`);
      throw new HttpException('Project not created', HttpStatus.BAD_REQUEST);
    }
    this.logger.log(`Updated task with id '${updateTask.id}'`);
    return updateTask;
  }
  
  async delete(user_id: string, project_id: string , number: number): Promise<TaskDocument> {
    const deletedTask = await this.taskModel.findOneAndDelete({user_id, number, project_id}).select({ _id: 0, __v: 0, project_id: 0, user_id: 0}).exec();
    if (deletedTask) {
      const tasks = await this.taskModel.find({ user_id, project_id }).sort({ number: -1 }).select({ number: 1 }).exec();
      tasks.forEach((task, index) => {
        this.taskModel.findByIdAndDelete(task._id, {number: index + 1})
      });
    }
    return deletedTask;
  }

  private TaskValidation(taskDto: TaskDto) {
    const { name, description, status, priority, start_date, end_date } = taskDto;
    
    const errors: Record<string, string> = {};

    if (name.length < 3) {
      errors.name = 'The name of the task is less than 3 characters';
    }
    if (name.length > 50) {
      errors.name = 'The name of the task is longer than 50 characters';
    }
    if (name.length === 0 || name === null || name === undefined) {
      errors.name = 'The name of the task is required';
    }
    if (!(description === undefined || description !== '') && description.length > 500) {
      errors.description = 'The description of the task is longer than 1500 characters';
    }

    if (!(status === undefined || status === '')) {
      const validStatuses = ['Not started', 'In progress', 'Done'];
      if (!validStatuses.includes(status)) {
        errors.status = 'Invalid status entered for the task';
      }
    }

    if (!(priority === undefined || priority === '')) {
      const validPriority = ['Low', 'Medium', 'High'];
      if (!validPriority.includes(priority)) {
        errors.priority = 'Invalid priority entered for the task';
      }
    }

    if (!(start_date === undefined || start_date === '')) {
      if (!this.validateDate(start_date)) {
        errors.start_date = 'Invalid start date entered for the task'
      }
    }

    if (!(end_date === undefined || end_date === '')) {
      if (!this.validateDate(end_date)) {
        errors.end_date = 'Invalid end date entered for the task'
      }
    }

    if (Object.keys(errors).length > 0) {
      this.logger.error(`Task validation failed`, `name: ${name}, description: ${description}`, errors)
      throw new HttpExceptionErrors('Task validation failed', HttpStatus.BAD_REQUEST, errors);
    }
  }

  private validateDate(dateString): boolean {
    const exceptionsWords = ['today', 'tomorrow']
    if (exceptionsWords.includes(dateString)) return true;
    const dateRegex = /^[0-9]{1,4}[-]{1}[0-9]{1,2}[-]{1}[0-9]{1,2}$/
    if (!dateRegex.test(dateString)) {
      return false;
    }
    const [yearStr, monthStr, dayStr] = dateString.split(/[-]/)
    const day = parseInt(dayStr);
    const month = parseInt(monthStr);
    const year = parseInt(yearStr);
    if (month < 1 || month > 12) {
      return false;
    }
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day < 1 || day > daysInMonth[month - 1]) {
      return false;
    }
    if (month === 2 && day === 29 && year % 4 !== 0) {
      return false;
    }
    return true;
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
};
