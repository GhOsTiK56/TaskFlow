import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ErrorResponseDto {
	@ApiProperty({
		example: 404
	})
	@IsNumber()
	statusCode!: number;

	@ApiProperty({
		example: 'User not found'
	})
	@IsString()
	message!: string;

	@ApiProperty({
		example: 'Not Found'
	})
	@IsString()
	error!: string;
}
