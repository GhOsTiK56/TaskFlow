import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
export class ProjectResponseDto {
	@ApiProperty({
		example: 'id'
	})
	@Expose()
	id!: string;

	@ApiProperty({
		example: 'ProjectName'
	})
	@Expose()
	name!: string;

	@ApiProperty({
		example: 'Description',
		required: false
	})
	@Expose()
	description?: string;

	@ApiProperty({
		example: '#00000',
		required: false
	})
	@Expose()
	color?: string;

	@ApiProperty({
		example: 'emoji',
		required: false
	})
	@Expose()
	icon?: string;

	@ApiProperty({
		example: '2026.05.05'
	})
	@Expose()
	createdAt!: Date;

	@ApiProperty({
		example: '2026.05.05'
	})
	@Expose()
	updatedAt!: Date;
}
