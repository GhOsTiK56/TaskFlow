import { Controller, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser, Protected } from '@/common';
import { OkResponseDto } from '../auth/dto';

@ApiBearerAuth()
@Protected()
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({
		summary: 'Delete user profile',
		description: 'Delete user profile'
	})
	@Delete(':id')
	public delete(@CurrentUser() userId: string): Promise<OkResponseDto> {
		return this.userService.delete(userId);
	}
}
