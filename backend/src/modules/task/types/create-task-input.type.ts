import { Priority, TaskStatus } from '@prisma/generated/client';

export type CreateTaskInput = {
	userId: string;
	projectId: string;
	title: string;
	description?: string;
	status: TaskStatus;
	priority: Priority;
	dueDate?: Date;
};
