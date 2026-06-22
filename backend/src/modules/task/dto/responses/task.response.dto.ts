import { ApiProperty } from '@nestjs/swagger';
import { Priority, TaskStatus } from '@prisma/generated/client';
import { Expose } from 'class-transformer';

export class TaskResponseDto {
	@ApiProperty({
		example: 'id'
	})
	@Expose()
	id!: string;

	@ApiProperty({
		example: 'projectId'
	})
	@Expose()
	projectId!: string;

	@ApiProperty({
		example: 'title'
	})
	@Expose()
	title!: string;

	@ApiProperty({
		example: 'description'
	})
	@Expose()
	description?: string;

	@ApiProperty({
		enum: TaskStatus,
		example: TaskStatus.TODO
	})
	@Expose()
	status!: TaskStatus;

	@ApiProperty({
		enum: Priority,
		example: Priority.MEDIUM
	})
	@Expose()
	priority!: Priority;

	@ApiProperty({ example: '2026-01-01T12:00:00.000Z', nullable: true })
	@Expose()
	dueDate?: Date;

	@ApiProperty({
		example: '2026-06-21T10:00:00.000Z'
	})
	@Expose()
	createdAt!: Date;

	@ApiProperty({
		example: '2026-06-21T10:05:00.000Z'
	})
	@Expose()
	updatedAt!: Date;
}
