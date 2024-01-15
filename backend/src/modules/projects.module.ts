import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsController } from '../controllers/projects.controller';
import { ProjectsService } from '../services/projects.service';
import { Project, ProjectSchema } from '../schemas/project.schema';
import { TaskSchema } from '../schemas/task.schema';
import { ProjectCoverController } from '../controllers/project-cover.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }, { name: 'Task', schema: TaskSchema }]),
  ],
  controllers: [ProjectsController, ProjectCoverController],
  providers: [ProjectsService],
  exports: [ProjectsService]
})
export class ProjectModule {}