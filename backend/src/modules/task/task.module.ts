import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.repository';
import { ProjectRepository } from '../project/project.repository';

@Module({
	controllers: [TaskController],
	providers: [TaskService, TaskRepository, ProjectRepository]
})
export class TaskModule {}
