import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskResponseDto } from './dto';
import { Prisma, Task } from '@prisma/generated/client';
import { plainToInstance } from 'class-transformer';
import { TaskRepository } from './task.repository';
import { ProjectRepository } from '../project/project.repository';
import type { CreateTaskInput, UpdateTaskInput } from './interfaces';

@Injectable()
export class TaskService {
	public constructor(
		private readonly taskRepository: TaskRepository,
		private readonly projectRepository: ProjectRepository
	) {}

	public async create(input: CreateTaskInput): Promise<TaskResponseDto> {
		await this.checkProjectOwn(input.userId, input.projectId);

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

	public async findAll(
		userId: string,
		projectId: string
	): Promise<TaskResponseDto[]> {
		await this.checkProjectOwn(userId, projectId);

		const tasks = await this.taskRepository.findAllTasks(userId, projectId);

		return tasks.map((task) => this.mapToDto(task));
	}

	public async findOne(
		userId: string,
		projectId: string,
		id: string
	): Promise<TaskResponseDto> {
		const task = await this.taskRepository.findOne(userId, projectId, id);

		if (!task) {
			throw new NotFoundException('Task not found');
		}

		return this.mapToDto(task);
	}

	public async update(input: UpdateTaskInput) {
		try {
			const updatedTask = await this.taskRepository.update(input);

			return this.mapToDto(updatedTask);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException('Task not found');
				}
			}
			throw error;
		}
	}

	public async updateMany() {}

	public async delete(userId: string, projectId: string, id: string) {
		try {
			await this.taskRepository.delete(userId, projectId, id);

			return { message: 'ok' };
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException('Task not found');
				}
			}
			throw error;
		}
	}

	private async checkProjectOwn(userId, projectId: string) {
		const project = await this.projectRepository.findOne(projectId);

		if (!project || project.userId !== userId) {
			throw new NotFoundException('Project not found');
		}
	}

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
