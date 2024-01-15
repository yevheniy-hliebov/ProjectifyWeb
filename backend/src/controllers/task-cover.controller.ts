import { Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Request, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TasksService } from "../services/tasks.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { ProjectsService } from "../services/projects.service";

@Controller('projects/:slug/tasks/:number/cover')
export class TaskCoverController {
  constructor(private readonly taskService: TasksService, private readonly projectsService: ProjectsService) { }

  @Get()
  async getCover(@Request() req: any, @Param('slug') slug: string, @Param('number') number: number, @Res() res: Response) {
    const project_id = await this.projectsService.findId({ slug, user_id: req.user.id });
    const task_id = await this.taskService.findId({ user_id: req.user.id, project_id: project_id, number: number });
    const cover = await this.taskService.getCover(task_id);
    res.writeHead(200, { 'Content-Type': cover.mimetype });
    res.end(cover.buffer, 'utf-8');
  }

  @Post()
  @UseInterceptors(FileInterceptor('cover-image'))
  async upload(@Request() req: any, @Param('slug') slug: string, @Param('number') number: number, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Image not sent to server', HttpStatus.BAD_REQUEST)
    }
    const project_id = await this.projectsService.findId({ slug, user_id: req.user.id });
    const task_id = await this.taskService.findId({ user_id: req.user.id, project_id: project_id, number: number });
    return await this.taskService.uploadCover(task_id, file);
  }

  @Put()
  @UseInterceptors(FileInterceptor('cover-image'))
  async update(@Request() req: any, @Param('slug') slug: string, @Param('number') number: number, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Image not sent to server', HttpStatus.BAD_REQUEST)
    }
    const project_id = await this.projectsService.findId({ slug, user_id: req.user.id });
    const task_id = await this.taskService.findId({ user_id: req.user.id, project_id: project_id, number: number });
    return await this.taskService.uploadCover(task_id, file);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Request() req: any, @Param('slug') slug: string, @Param('number') number: number) {
    const project_id = await this.projectsService.findId({ slug, user_id: req.user.id });
    const task_id = await this.taskService.findId({ user_id: req.user.id, project_id: project_id, number: number });
    await this.taskService.deleteCover(task_id);
  }
}