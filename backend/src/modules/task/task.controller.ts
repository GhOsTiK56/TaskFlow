import { Body, Controller, Param, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CurrentUser, Protected } from '@/common';
import { CreateTaskRequestDto, TaskResponseDto } from './dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Protected()
@Controller('task')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Post(':projectId')
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
}
