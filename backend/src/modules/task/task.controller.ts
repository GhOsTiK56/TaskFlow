import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CurrentUser, Protected } from '@/common';
import {
	CreateTaskRequestDto,
	TaskResponseDto,
	UpdateTaskRequestDto
} from './dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OkResponseDto } from '../auth/dto';

@ApiBearerAuth()
@Protected()
@Controller('projects/:projectId/task')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Post()
	public create(
		@CurrentUser() userId: string,
		@Param('projectId') projectId: string,
		@Body() data: CreateTaskRequestDto
	): Promise<TaskResponseDto> {
		return this.taskService.create({
			userId,
			projectId,
			...data
		});
	}

	@Get()
	public findAll(
		@CurrentUser() userId: string,
		@Param('projectId') projectId: string
	): Promise<TaskResponseDto[]> {
		return this.taskService.findAll(userId, projectId);
	}

	@Get(':id')
	public findOne(
		@CurrentUser() userId: string,
		@Param('projectId') projectId: string,
		@Param('id') id: string
	): Promise<TaskResponseDto> {
		return this.taskService.findOne(userId, projectId, id);
	}

	@Patch(':id')
	public update(
		@CurrentUser() userId: string,
		@Param('projectId') projectId: string,
		@Param('id') id: string,
		@Body() data: UpdateTaskRequestDto
	): Promise<TaskResponseDto> {
		return this.taskService.update({ userId, projectId, id, ...data });
	}

	@Patch('bulk')
	public updateMany() {}

	@Delete(':id')
	public delete(
		@CurrentUser() userId: string,
		@Param('projectId') projectId: string,
		@Param('id') id: string
	): Promise<OkResponseDto> {
		return this.taskService.delete(userId, projectId, id);
	}
}
