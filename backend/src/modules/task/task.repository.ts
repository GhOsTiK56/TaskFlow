import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Priority, Task, TaskStatus } from '@prisma/generated/client';

@Injectable()
export class TaskRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findProjectForUser(projectId: string, userId: string) {
		return await this.prismaService.project.findFirst({
			where: {
				userId,
				id: projectId,
				deletedAt: null
			}
		});
	}

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
}
