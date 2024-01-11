import { Body, Controller, Delete, Get, HttpCode, Logger, Param, Post, Put, Query, Request } from "@nestjs/common";
import { TasksService } from "../services/tasks.service";
import { ProjectsService } from "../services/projects.service";
import { TaskDto } from "../interfaces/task.interface";
import { Task, TaskDocument } from "../schemas/task.schema";

@Controller('/projects/:slug/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService, private readonly projectsService: ProjectsService) { }
  private readonly limitTasks = 25;

  @Get()
  async findAllInProject(@Request() req, @Param('slug') project_slug: string, @Query('page') page?: number, @Query('sortBy') sortBy?: string, @Query('searchText') searchText?: string): Promise<{ count: number, tasks: Task[], page: number, pages_count: number }> {    
    const user_id = req.user.id;

    let skip = 0;
    
    if(isNaN(page) || page < 1) {
      page = 1
    } else {
      page = Number(page);
    }
    skip = (page - 1) * Number(this.limitTasks);

    const project_id = await this.projectsService.findId({user_id, id: project_slug});
    const returnResult = await this.tasksService.findAllInProject(user_id, project_id, sortBy, searchText, skip, this.limitTasks)
    return returnResult;
  }

  @Post()
  async create(@Request() req, @Param('slug') project_slug: string, @Body() taskDto: TaskDto): Promise<Task> {
    const user_id = req.user.id;
    const project_id = await this.projectsService.findId({user_id, id: project_slug});
    taskDto.project_id = project_id;
    taskDto.user_id = req.user.id;
    return await this.tasksService.create(taskDto);
  }

  @Get('/:number')
  async findOne(@Request() req, @Param('slug') project_slug: string, @Param('number') number: number): Promise<Task> {
    const user_id = req.user.id;
    const project_id = await this.projectsService.findId({user_id, id: project_slug});
    return await this.tasksService.findByNumberAndProjectId(user_id, project_id, number)
  }
  
  @Put('/:number')
  async update(@Request() req, @Param('slug') project_slug: string, @Param('number') number: number, @Body() taskDto: TaskDto): Promise<Task> {
    const user_id = req.user.id;
    const project_id = await this.projectsService.findId({user_id, id: project_slug});
    return await this.tasksService.update(user_id, project_id, number, taskDto)
  }

  @Delete('/:number')
  @HttpCode(204)
  async delete(@Request() req, @Param('slug') project_slug: string, @Param('number') number: number): Promise<Task> {
    const user_id = req.user.id;
    const project_id = await this.projectsService.findId({user_id, id: project_slug});
    return await this.tasksService.delete(user_id, project_id, number)
  }
};
