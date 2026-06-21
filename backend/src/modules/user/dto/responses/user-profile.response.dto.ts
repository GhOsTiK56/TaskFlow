import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserProfileResponseDto {
	@ApiProperty({
		example: 'email@mail.com'
	})
	email!: string;

	@ApiProperty({
		example: 'Name'
	})
	@IsOptional()
	name?: string;
}
