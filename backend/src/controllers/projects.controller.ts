import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpCode } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../schemas/project.schema';
import { ProjectData } from 'src/interfaces/project.interface';
import { Public } from 'src/auth/auth.guard';

@Public()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Query('sortBy') sortBy?: string, @Query('searchText') searchText?: string): Promise<Project[]> {
    return this.projectsService.findAll(sortBy, searchText);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<Project> {
    return this.projectsService.findBySlug(slug);
  }

  @Post()
  async create(@Body() projectData): Promise<Project> {
    return this.projectsService.create(projectData);
  }

  @Put(':slug')
  async update(@Param('slug') slug: string, @Body() projectData: ProjectData): Promise<Project> {
    const id = await this.projectsService.findIdBySlug(slug);
    return this.projectsService.update(id, slug, projectData);
  }
  
  @Delete(':slug')
  @HttpCode(204)
  async delete(@Param('slug') slug: string) {
    const id = await this.projectsService.findIdBySlug(slug);
    return this.projectsService.delete(id);
  }
}