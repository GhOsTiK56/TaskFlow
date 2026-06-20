import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto, TokensResponseDto } from './dto';
import {
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger';
import { LoginRequestDto } from './dto/requests/login.request.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@ApiOperation({
		summary: 'Register user',
		description: 'Register user'
	})
	@ApiCreatedResponse({
		type: TokensResponseDto
	})
	@HttpCode(HttpStatus.CREATED)
	public register(
		@Body() data: RegisterRequestDto
	): Promise<TokensResponseDto> {
		return this.authService.register(data);
	}

	@Post('login')
	@ApiOperation({
		summary: 'Login to account',
		description: 'Login to account'
	})
	@ApiOkResponse({
		description: 'return refresh & access tokens',
		type: TokensResponseDto
	})
	@HttpCode(HttpStatus.OK)
	public login(@Body() data: LoginRequestDto): Promise<TokensResponseDto> {
		return this.authService.login(data);
	}
}
