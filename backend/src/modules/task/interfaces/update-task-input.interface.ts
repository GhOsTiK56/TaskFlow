import { Priority, TaskStatus } from '@prisma/generated/enums';

export interface UpdateTaskInput {
	userId: string;
	projectId: string;
	id: string;
	title?: string;
	description?: string;
	status?: TaskStatus;
	priority?: Priority;
	dueDate?: Date;
}
