import { Controller, Delete, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { CurrentUser, Protected } from '@/common';
import { OkResponseDto } from '../auth/dto';
import { ErrorResponseDto } from '@/common/dto';
import { UserProfileResponseDto } from './dto';

@ApiBearerAuth()
@Protected()
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('@me')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Get current user profile',
		description: 'Returns authenticated user profile'
	})
	@ApiOkResponse({
		description: 'User profile',
		type: UserProfileResponseDto
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: ErrorResponseDto
	})
	public getProfile(
		@CurrentUser() userId: string
	): Promise<UserProfileResponseDto> {
		return this.userService.findById(userId);
	}

	//TODO: Добавить обновление профиля пользователя

	@Delete('@me')
	@ApiOperation({
		summary: 'Delete current user account',
		description: 'Deletes authenticated user account'
	})
	@ApiOkResponse({
		description: 'User deleted',
		type: OkResponseDto
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: ErrorResponseDto
	})
	public delete(@CurrentUser() userId: string): Promise<OkResponseDto> {
		return this.userService.delete(userId);
	}
}
