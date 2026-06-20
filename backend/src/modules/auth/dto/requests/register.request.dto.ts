import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator';

export class RegisterRequestDto {
	@ApiProperty({
		example: 'email@mail.com'
	})
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({
		example: '123456'
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(30)
	password: string;

	@ApiProperty({
		example: 'Name'
	})
	@IsString()
	@IsOptional()
	name?: string;
}
