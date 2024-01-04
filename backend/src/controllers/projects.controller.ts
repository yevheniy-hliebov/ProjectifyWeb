import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpCode, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../schemas/project.schema';
import { ProjectData } from 'src/interfaces/project.interface';
import { Public } from 'src/auth/auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }
  
  @Public()
  @Get()
  async findAll(@Query('sortBy') sortBy?: string, @Query('searchText') searchText?: string): Promise<{ count: number, projects: Project[] }> {
    const projects = await this.projectsService.findAll(sortBy, searchText);
    const count = projects.length;
    
    return { count, projects };
  }
  
  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<Project> {
    return await this.projectsService.findBySlug(slug);
  }
  
  @Post()
  async create(@Body() projectData, @Request() req): Promise<Project> {
    const reqUser = req.user;
    projectData.user_id = reqUser.id;
    return await this.projectsService.create(projectData);
  }
  
  @Get(':slug/permission')
  async checkPermission(@Param('slug') slug: string, @Request() req): Promise<Project> {
    return await this.projectsService.checkPermission(slug, req.user.id);
  }

  @Put(':slug')
  async update(@Param('slug') slug: string, @Body() projectData: ProjectData, @Request() req): Promise<Project> {
    const project = await this.projectsService.findBySlug(slug);
    const reqUser = req.user;
    if (project.user_id !== reqUser.id) {
      throw new HttpException("Insufficient rights to access the project", HttpStatus.FORBIDDEN)
    }
    const idProject = await this.projectsService.findIdBySlug(slug);
    return await this.projectsService.update(idProject, slug, projectData);
  }

  @Delete(':slug')
  @HttpCode(204)
  async delete(@Param('slug') slug: string) {
    const id = await this.projectsService.findIdBySlug(slug);
    return await this.projectsService.delete(id);
  }
}