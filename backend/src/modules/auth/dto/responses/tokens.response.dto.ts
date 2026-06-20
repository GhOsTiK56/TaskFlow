import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokensResponseDto {
	@ApiProperty({
		example: 'accessToken'
	})
	@IsString()
	@IsNotEmpty()
	accessToken: string;

	@ApiProperty({
		example: 'refreshToken'
	})
	@IsString()
	@IsNotEmpty()
	refreshToken: string;
}
