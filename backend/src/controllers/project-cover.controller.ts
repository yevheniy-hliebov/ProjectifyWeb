import { Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Request, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ProjectsService } from "../services/projects.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

@Controller('projects/:slug/cover')
export class ProjectCoverController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Get()
  async getCover(@Request() req: any, @Param('slug') slug: string, @Res() res: Response) {
    const project_id = await this.projectsService.findId({ slug, user_id: req.user.id });
    const cover = await this.projectsService.getCover(project_id);
    res.writeHead(200, { 'Content-Type': cover.mimetype });
    res.end(cover.buffer, 'utf-8');
  }

  @Post()
  @UseInterceptors(FileInterceptor('cover-image'))
  async upload(@Request() req: any, @Param('slug') slug: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Image not sent to server', HttpStatus.BAD_REQUEST)
    }
    const project_id = await this.projectsService.findId({ slug, user_id: req.user.id });
    return await this.projectsService.uploadCover(project_id, file);
  }

  @Put()
  @UseInterceptors(FileInterceptor('cover-image'))
  async update(@Request() req: any, @Param('slug') slug: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Image not sent to server', HttpStatus.BAD_REQUEST)
    }
    const project_id = await this.projectsService.findId({ slug, user_id: req.user.id });
    return await this.projectsService.uploadCover(project_id, file);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Request() req: any, @Param('slug') slug: string) {
    const project_id = await this.projectsService.findId({ slug, user_id: req.user.id });
    await this.projectsService.deleteCover(project_id);
  }
}