import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpCode, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../schemas/project.schema';
import { ProjectData } from '../interfaces/project.interface';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }
  
  @Get()
  async findAll(@Request() req, @Query('sortBy') sortBy?: string, @Query('searchText') searchText?: string): Promise<{ count: number, projects: Project[] }> {
    const reqUser = req.user;
    const projects = await this.projectsService.findAll(reqUser.id, sortBy, searchText);
    const count = projects.length;
    
    return { count, projects };
  }

  @Get(':slug')
  async findOne(@Request() req, @Param('slug') slug: string): Promise<Project> {
    const reqUser = req.user;
    return await this.projectsService.findBySlug(slug, reqUser.id);
  }
  
  @Post()
  async create(@Body() projectData, @Request() req): Promise<Project> {
    const reqUser = req.user;
    projectData.user_id = reqUser.id;
    return await this.projectsService.create(projectData);
  }
  

  @Put(':slug')
  async update(@Param('slug') slug: string, @Body() projectData: ProjectData, @Request() req): Promise<Project> {
    const reqUser = req.user;
    const id = await this.projectsService.findIdBySlug(slug, reqUser.id);
    return await this.projectsService.update(id, slug, projectData);
  }

  @Delete(':slug')
  @HttpCode(204)
  async delete(@Param('slug') slug: string, @Request() req) {
    const reqUser = req.user;
    const id = await this.projectsService.findIdBySlug(slug, reqUser.id);
    return await this.projectsService.delete(id);
  }
}