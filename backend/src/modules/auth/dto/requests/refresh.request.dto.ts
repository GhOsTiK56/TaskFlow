import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshRequestDto {
	@ApiProperty({
		example: 'token'
	})
	@IsString()
	@IsNotEmpty()
	refreshToken!: string;
}
