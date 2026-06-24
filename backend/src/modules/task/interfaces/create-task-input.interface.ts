import { Priority, TaskStatus } from '@prisma/generated/client';

export interface CreateTaskInput {
	userId: string;
	projectId: string;
	title: string;
	description?: string;
	status: TaskStatus;
	priority: Priority;
	dueDate?: Date;
}
