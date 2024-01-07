import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Request } from "@nestjs/common";
import { TasksService } from "../services/tasks.service";
import { ProjectsService } from "../services/projects.service";
import { TaskDto } from "../interfaces/task.interface";
import { Task } from "../schemas/task.schema";

@Controller('/projects/:slug/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService, private readonly projectsService: ProjectsService) { }

  @Get()
  async findAllInProject(@Request() req, @Param('slug') project_slug: string, @Query('sortBy') sortBy?: string, @Query('searchText') searchText?: string): Promise<{ count: number, tasks: Task[] }> {    
    const reqUser = req.user;
    const project_id = await this.projectsService.findIdBySlug(project_slug, reqUser.id);
    const tasks = await this.tasksService.findAllInProject(reqUser.id, project_id, sortBy, searchText)
    const count = tasks.length;
    return { count, tasks };
  }

  @Post()
  async create(@Request() req, @Param('slug') project_slug: string, @Body() taskDto: TaskDto): Promise<Task> {
    const reqUser = req.user;
    const project_id = await this.projectsService.findIdBySlug(project_slug, reqUser.id);
    taskDto.project_id = project_id;
    taskDto.user_id = req.user.id;
    return await this.tasksService.create(taskDto);
  }

  @Get('/:number')
  async findOne(@Request() req, @Param('slug') project_slug: string, @Param('number') number: number): Promise<Task> {
    const reqUser = req.user;
    const project_id = await this.projectsService.findIdBySlug(project_slug, reqUser.id);
    return await this.tasksService.findByNumberAndProjectId(reqUser.id, project_id, number)
  }
  
  @Put('/:number')
  async update(@Request() req, @Param('slug') project_slug: string, @Param('number') number: number, @Body() taskDto: TaskDto): Promise<Task> {
    const reqUser = req.user;
    const project_id = await this.projectsService.findIdBySlug(project_slug, reqUser.id);
    return await this.tasksService.update(reqUser.id, project_id, number, taskDto)
  }

  @Delete('/:number')
  @HttpCode(204)
  async delete(@Request() req, @Param('slug') project_slug: string, @Param('number') number: number): Promise<Task> {
    const reqUser = req.user;
    const project_id = await this.projectsService.findIdBySlug(project_slug, reqUser.id);
    return await this.tasksService.delete(reqUser.id, project_id, number)
  }
};
