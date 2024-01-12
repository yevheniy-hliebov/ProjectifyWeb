import { Body, Controller, Delete, Get, HttpCode, Logger, Param, Post, Put, Query, Request } from "@nestjs/common";
import { TasksService } from "../services/tasks.service";
import { ProjectsService } from "../services/projects.service";
import { TaskDto } from "../interfaces/task.interface";
import { Task, TaskDocument } from "../schemas/task.schema";
import { validateDate } from "../validation/date.validation";

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
    @Query('created') created?: string,
    @Query('updated') updated?: string,
  ): Promise<{ count: number, tasks: Task[], page: number, pages_count: number }> {
    const user_id = req.user.id;
    page = (isNaN(page) || page < 1) ? 1 : Number(page);
    const skip = (page - 1) * this.limitTasks;

    const filter: any = { user_id };
    if (hasDescription === 'true' || hasDescription === '') filter.description = { $ne: '' }
    if (noDescription === 'true' || noDescription === '') filter.description = ''
    if ((hasDescription === 'true' || hasDescription === '') && (noDescription === 'true' || noDescription === '')) {
      if ('description' in filter) delete filter.description
    }
    const createdAt = this.setFilterDate(created);
    if (createdAt) {
      filter.createdAt = createdAt;
    }
    const updatedAt = this.setFilterDate(updated);
    if (updatedAt) {
      filter.updatedAt = updatedAt;
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
    return await this.tasksService.update(user_id, project_id, number, taskDto)
  }

  @Delete('/:number')
  @HttpCode(204)
  async delete(@Request() req, @Param('slug') project_slug: string, @Param('number') number: number): Promise<Task> {
    const user_id = req.user.id;
    const project_id = await this.projectsService.findId({ user_id, slug: project_slug });
    return await this.tasksService.delete(user_id, project_id, number)
  }

  private setFilterDate(date) {
    const createdFilter: any = {};
    if (date) {
      let [gteDate, lteDate] = date.split(/\,/);
      if (validateDate(gteDate)) {
        createdFilter.$gte = new Date(gteDate);
      }
      if (validateDate(lteDate)) {
        createdFilter.$lte = new Date(lteDate);
      }
    }
    return Object.keys(createdFilter).length > 1 ? createdFilter : undefined;
  }
};
