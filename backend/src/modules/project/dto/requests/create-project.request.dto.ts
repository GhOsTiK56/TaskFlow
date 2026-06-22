import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectRequestDto {
	@ApiProperty({
		example: 'NameProject'
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		example: 'Description',
		required: false
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({
		example: '#00000',
		required: false
	})
	@IsString()
	@IsOptional()
	color?: string;

	@ApiProperty({
		example: 'emoji',
		required: false
	})
	@IsString()
	@IsOptional()
	icon?: string;
}
