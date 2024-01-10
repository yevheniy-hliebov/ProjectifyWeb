import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpCode, Request, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../schemas/project.schema';
import { ProjectData } from '../interfaces/project.interface';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }
  private readonly limitProjects = 10;

  @Get()
  async findAll(@Request() req, @Query('page') page?: number, @Query('sortBy') sortBy?: string, @Query('searchText') searchText?: string): Promise<{ count: number, projects: Project[], page: number, pages_count: number }> {
    const user_id = req.user.id;
    let skip = 0;
    
    if(isNaN(page) || page < 1) {
      page = 1
    } else {
      page = Number(page);
    }
    skip = (page - 1) * Number(this.limitProjects);
    
    const findResult = await this.projectsService.findAll(user_id, sortBy, searchText, skip, this.limitProjects);
    return findResult;
  }

  @Get('pages-count')
  async getCountPages(@Request() req) {
    const user_id = req.user.id;  
    return { pages_count: await this.projectsService.getCountPages(user_id, this.limitProjects)};
  }
  
  @Get(':slug')
  async read(@Request() req, @Param('slug') slug: string): Promise<Project> {
    const user_id = req.user.id;
    return await this.projectsService.findBySlug(slug, user_id);
  }
  
  @Post()
  async create(@Body() projectData, @Request() req): Promise<Project> {
    const user_id = req.user.id;
    projectData.user_id = user_id;
    return await this.projectsService.create(projectData);
  }
  

  @Put(':slug')
  async update(@Param('slug') slug: string, @Body() projectData: ProjectData, @Request() req): Promise<Project> {
    const user_id = req.user.id;
    const id = await this.projectsService.findIdBySlug(slug, user_id);
    return await this.projectsService.update(id, slug, projectData);
  }

  @Delete(':slug')
  @HttpCode(204)
  async delete(@Param('slug') slug: string, @Request() req) {
    const user_id = req.user.id;
    const id = await this.projectsService.findIdBySlug(slug, user_id);
    return await this.projectsService.delete(id);
  }
}