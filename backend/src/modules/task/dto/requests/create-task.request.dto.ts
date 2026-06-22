import { ApiProperty } from '@nestjs/swagger';
import { Priority, TaskStatus } from '@prisma/generated/client';
import { Type } from 'class-transformer';
import {
	IsDate,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength
} from 'class-validator';

export class CreateTaskRequestDto {
	@ApiProperty({
		example: 'title'
	})
	@IsString()
	@MaxLength(255)
	@IsNotEmpty()
	title!: string;

	@ApiProperty({
		example: 'description',
		required: false
	})
	@IsString()
	@MaxLength(10000)
	@IsOptional()
	description?: string;

	@ApiProperty({
		enum: TaskStatus,
		example: TaskStatus.TODO,
		default: TaskStatus.TODO
	})
	@IsEnum(TaskStatus)
	status!: TaskStatus;

	@ApiProperty({
		enum: Priority,
		example: Priority.MEDIUM,
		default: Priority.MEDIUM
	})
	@IsEnum(Priority)
	@IsNotEmpty()
	priority!: Priority;

	@ApiProperty({ example: '2026-01-01T12:00:00.000Z', required: false })
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	dueDate?: Date;
}
