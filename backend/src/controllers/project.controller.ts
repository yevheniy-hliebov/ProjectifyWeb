import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpCode } from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { Project } from '../schemas/project.schema';
import { ProjectData } from 'src/interfaces/project.interface';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAll(@Query('sortBy') sortBy?: string, @Query('searchText') searchText?: string): Promise<Project[]> {
    return this.projectService.findAll(sortBy, searchText);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<Project> {
    return this.projectService.findBySlug(slug);
  }

  @Post()
  async create(@Body() projectData): Promise<Project> {
    return this.projectService.create(projectData);
  }

  @Put(':slug')
  async update(@Param('slug') slug: string, @Body() projectData: ProjectData): Promise<Project> {
    const id = await this.projectService.findIdBySlug(slug);
    return this.projectService.update(id, slug, projectData);
  }
  
  @Delete(':slug')
  @HttpCode(204)
  async delete(@Param('slug') slug: string) {
    const id = await this.projectService.findIdBySlug(slug);
    return this.projectService.delete(id);
  }
}