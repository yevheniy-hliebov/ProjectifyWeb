import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsController } from '../controllers/projects.controller';
import { ProjectsService } from '../services/projects.service';
import { Project, ProjectSchema } from '../schemas/project.schema';
import { TaskModule } from './tasks.module';
import { TasksService } from '../services/tasks.service';
import { TaskSchema } from '../schemas/task.schema';
import { ProjectCoversController } from '../controllers/project-covers.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }, { name: 'Task', schema: TaskSchema }]),
  ],
  controllers: [ProjectsController, ProjectCoversController],
  providers: [ProjectsService],
  exports: [ProjectsService]
})
export class ProjectModule {}