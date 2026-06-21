import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskResponseDto } from './dto';
import { Prisma, Task } from '@prisma/generated/client';
import { plainToInstance } from 'class-transformer';
import type { CreateTaskInput } from './types';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
	public constructor(private readonly taskRepository: TaskRepository) {}

	public async create(input: CreateTaskInput): Promise<TaskResponseDto> {
		const project = await this.taskRepository.findProjectForUser(
			input.projectId,
			input.userId
		);

		if (!project) {
			throw new NotFoundException('Project not found');
		}

		try {
			const task = await this.taskRepository.create(input);

			return this.mapToDto(task);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2003') {
					throw new NotFoundException('Project not found');
				}
			}
			throw error;
		}
	}

	public async findAll() {}

	public async findOne() {}

	public async updateOne() {}

	public async delete() {}

	public async updateMany() {}

	private mapToDto(task: Task): TaskResponseDto {
		return plainToInstance(
			TaskResponseDto,
			{
				id: task.id,
				projectId: task.projectId,
				title: task.title,
				description: task.description || undefined,
				status: task.status,
				priority: task.priority,
				dueDate: task.dueDate || undefined,
				createdAt: task.createdAt,
				updatedAt: task.updatedAt
			},
			{ excludeExtraneousValues: true }
		);
	}
}
