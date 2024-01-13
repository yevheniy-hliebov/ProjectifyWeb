import { Body, Controller, Delete, Get, HttpCode, Logger, Param, Post, Put, Query, Request } from "@nestjs/common";
import { TasksService } from "../services/tasks.service";
import { ProjectsService } from "../services/projects.service";
import { Task, TaskDocument } from "../schemas/task.schema";
import { validateDate } from "../validation/date.validation";
import { TaskDto } from "../types/task.type";

@Controller('/projects/:slug/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService, private readonly projectsService: ProjectsService) { }
  private readonly limitTasks = 25;

  @Get()
  async findAll(
    @Request() req: any,
    @Param('slug') project_slug: string,
    @Query('page') page?: number,
    @Query('sort') sort?: string,
    @Query('search') search?: string,
    @Query('has_description') hasDescription?: string,
    @Query('no_description') noDescription?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('deadline') deadline?: string,
    @Query('created') created?: string,
    @Query('updated') updated?: string,
  ): Promise<{ count: number, tasks: Task[], page: number, pages_count: number }> {
    const user_id = req.user.id;
    page = (isNaN(page) || page < 1) ? 1 : Number(page);
    const skip = (page - 1) * this.limitTasks;

    let filter: any = { user_id };
    if (hasDescription === 'true' || hasDescription === '') filter.description = { $ne: '' }
    if (noDescription === 'true' || noDescription === '') filter.description = ''
    if ((hasDescription === 'true' || hasDescription === '') && (noDescription === 'true' || noDescription === '')) {
      if ('description' in filter) delete filter.description
    }
    
    if (status) {
      const validStatuses = ['Not started', 'In progress', 'Done'];
      let index = undefined;
      validStatuses.forEach((validStatus, i) => {
        if (validStatus.toLowerCase() === status.toLowerCase()) {
          index = i;
        }
      });
      if (index !== undefined) filter.status = validStatuses[index];
    }
    if (priority) {
      const validPriorities = ['Low', 'Medium', 'High'];
      let index = undefined;
      validPriorities.forEach((validPriority, i) => {
        if (validPriority.toLowerCase() === priority.toLowerCase()) {
          index = i;
        }
      });
      if (index !== undefined) filter.priority = validPriorities[index];
    }

    const deadlineFilter = this.setFilterDeadline(deadline, filter);
    if (deadlineFilter) {
      filter = deadlineFilter;
    }

    const createdFilter = this.setFilterDate(created);
    if (createdFilter) {
      filter.createdAt = createdFilter;
    }
    const updatedFilter = this.setFilterDate(updated);
    if (updatedFilter) {
      filter.updatedAt = updatedFilter;
    }

    const project_id = await this.projectsService.findId({ user_id, slug: project_slug });
    filter.project_id = project_id;
    return await this.tasksService.findAll({
      skip: skip,
      limit: this.limitTasks,
      sort: sort,
      search: {
        searchText: search,
        fields: ['name']
      },
      filter: filter
    })
  }

  @Post()
  async create(@Request() req, @Param('slug') project_slug: string, @Body() taskDto: TaskDto): Promise<Task> {
    const user_id = req.user.id;
    const project_id = await this.projectsService.findId({ user_id, slug: project_slug });
    taskDto.project_id = project_id;
    taskDto.user_id = req.user.id;
    return await this.tasksService.create(taskDto);
  }

  @Get('/:number')
  async read(@Request() req, @Param('slug') project_slug: string, @Param('number') number: number): Promise<Task> {
    const user_id = req.user.id;
    const project_id = await this.projectsService.findId({ user_id, slug: project_slug });
    return await this.tasksService.findOne({ user_id, project_id, number })
  }

  @Put('/:number')
  async update(@Request() req, @Param('slug') project_slug: string, @Param('number') number: number, @Body() taskDto: TaskDto): Promise<Task> {
    const user_id = req.user.id;
    const project_id = await this.projectsService.findId({ user_id, slug: project_slug });
    const task_id = await this.tasksService.findId({ user_id, project_id, number });
    return await this.tasksService.update(task_id, taskDto)
  }
  
  @Delete('/:number')
  @HttpCode(204)
  async delete(@Request() req, @Param('slug') project_slug: string, @Param('number') number: number) {
    const user_id = req.user.id;
    const project_id = await this.projectsService.findId({ user_id, slug: project_slug });
    const task_id = await this.tasksService.findId({ user_id, project_id, number });
    return await this.tasksService.delete(task_id)
  }

  private setFilterDate(date) {
    const dateFilter: any = {};
    if (date) {
      let [gteDate, lteDate] = date.split(/\,/);
      if (validateDate(gteDate)) {
        dateFilter.$gte = new Date(gteDate);
      }
      if (validateDate(lteDate)) {
        dateFilter.$lte = new Date(lteDate);
      }
    }
    return Object.keys(dateFilter).length > 1 ? dateFilter : undefined;
  }

  private setFilterDeadline(deadline, filter: any = {}) {
    if (deadline) {
      let [gteDate, lteDate] = deadline.split(/\,/);
      if (validateDate(gteDate)) {
        filter.start_date = {
          $gte: gteDate
        }
      }
      if (validateDate(lteDate)) {
        filter.end_date = {
          $lte: lteDate
        }
      }
    }
    return Object.keys(filter).length > 1 ? filter : undefined;
  }
};
