import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Priority, Task, TaskStatus } from '@prisma/generated/client';
import { UpdateTaskInput } from './interfaces';

@Injectable()
export class TaskRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async create(data: {
		userId: string;
		projectId: string;
		title: string;
		description?: string;
		status: TaskStatus;
		priority: Priority;
		dueDate?: Date;
	}): Promise<Task> {
		return await this.prismaService.task.create({
			data
		});
	}

	public async findOne(
		userId: string,
		projectId: string,
		id: string
	): Promise<Task> {
		return await this.prismaService.task.findFirst({
			where: {
				userId,
				projectId,
				id
			}
		});
	}

	public async findAllTasks(
		userId: string,
		projectId: string
	): Promise<Task[]> {
		return this.prismaService.task.findMany({
			where: {
				userId,
				projectId
			}
		});
	}

	public async update(data: UpdateTaskInput): Promise<Task> {
		const { userId, projectId, id, ...updateData } = data;

		return await this.prismaService.task.update({
			where: {
				userId,
				projectId,
				id
			},
			data: {
				...updateData
			}
		});
	}

	public async delete(userId: string, projectId: string, id: string) {
		return await this.prismaService.task.delete({
			where: {
				userId,
				projectId,
				id
			}
		});
	}
}
