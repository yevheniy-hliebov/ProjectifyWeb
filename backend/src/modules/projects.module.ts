import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsController } from '../controllers/projects.controller';
import { ProjectsService } from '../services/projects.service';
import { Project, ProjectSchema } from '../schemas/project.schema';
import { TaskModule } from './tasks.module';
import { TasksService } from 'src/services/tasks.service';
import { TaskSchema } from 'src/schemas/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }, { name: 'Task', schema: TaskSchema }]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService]
})
export class ProjectModule {}