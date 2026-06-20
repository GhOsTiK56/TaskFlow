import { Controller, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({
		summary: 'Delete user profile',
		description: 'Delete user profile'
	})
	@Delete(':id')
	public delete(@Param('id') userId: string) {
		return this.userService.delete(userId);
	}
}
