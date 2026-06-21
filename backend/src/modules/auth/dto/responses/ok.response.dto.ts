import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OkResponseDto {
	@ApiProperty({
		example: 'ok'
	})
	@IsString()
	message!: string;
}
