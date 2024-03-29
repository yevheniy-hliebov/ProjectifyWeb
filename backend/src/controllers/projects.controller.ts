import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpCode, Request, HttpStatus } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../schemas/project.schema';
import { validateDate } from '../validation/date.validation';
import { ProjectDto } from '../types/project.type';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }
  private readonly limitProjects = 10;

  @Get()
  async findAll(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('sort') sort?: string,
    @Query('search') search?: string,
    @Query('has_description') hasDescription?: string,
    @Query('no_description') noDescription?: string,
    @Query('created') created?: string,
    @Query('updated') updated?: string,
  ) {
    const user_id = req.user.id;
    page = (isNaN(page) || page < 1) ? 1 : Number(page);
    const skip = (page - 1) * this.limitProjects;

    const filter: any = { user_id };
    if (hasDescription === 'true' || hasDescription === '') filter.description = { $ne: '' }
    if (noDescription === 'true' || noDescription === '') filter.description = ''
    if ((hasDescription === 'true' || hasDescription === '') && (noDescription === 'true' || noDescription === '')) {
      if ('description' in filter) delete filter.description
    }
    const createdFilter = this.setFilterDate(created);
    if (createdFilter) {
      filter.createdAt = createdFilter;
    }
    const updatedFilter = this.setFilterDate(updated);
    if (updatedFilter) {
      filter.updatedAt = updatedFilter;
    }

    return await this.projectsService.findAll({
      skip: skip,
      limit: this.limitProjects,
      sort: sort,
      search: {
        searchText: search,
        fields: ['name', 'description']
      },
      filter: filter
    })
  }

  @Get(':slug')
  async read(@Request() req, @Param('slug') slug: string): Promise<Project> {
    const user_id = req.user.id;
    return await this.projectsService.findOne({ user_id, slug });
  }

  @Post()
  async create(@Body() projectDto: ProjectDto, @Request() req): Promise<Project> {
    const user_id = req.user.id;
    projectDto.user_id = user_id;
    return await this.projectsService.create(projectDto);
  }

  @Put(':slug')
  async update(@Param('slug') slug: string, @Body() projectDto: ProjectDto, @Request() req): Promise<Project> {
    const user_id = req.user.id;
    const id = await this.projectsService.findId({ user_id, slug });
    projectDto.user_id = user_id;
    return await this.projectsService.update(id, projectDto);
  }

  @Delete(':slug')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('slug') slug: string, @Request() req) {
    const user_id = req.user.id;
    const id = await this.projectsService.findId({ user_id, slug });
    return await this.projectsService.delete(id);
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
    return Object.keys(dateFilter).length > 0 ? dateFilter : undefined;
  }
}