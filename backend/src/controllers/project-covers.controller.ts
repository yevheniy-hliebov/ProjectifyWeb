import { Controller, HttpException, HttpStatus, Param, ParseFilePipeBuilder, Post, Request, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ProjectsService } from "../services/projects.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('projects/:slug/cover')
export class ProjectCoversController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Request() req: any, @Param('slug') slug: string, @UploadedFile() file: Express.Multer.File) {
    const project_id = await this.projectsService.findId({ slug, user_id: req.user.id });
    return await this.projectsService.uploadCover(project_id, file);
  }
}
