import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksController } from '../controllers/tasks.controller';
import { Task, TaskSchema } from '../schemas/task.schema';
import { TasksService } from '../services/tasks.service';
import { ProjectModule } from './projects.module';
import { TaskCoverController } from '../controllers/task-cover.controller';

@Module({
  imports: [
    ProjectModule,
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TasksController, TaskCoverController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TaskModule {}