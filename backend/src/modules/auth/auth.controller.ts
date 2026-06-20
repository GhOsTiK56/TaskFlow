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

	@ApiOperation({
		summary: 'Register user',
		description: 'Register user'
	})
	@ApiCreatedResponse({
		type: TokensResponseDto
	})
	@HttpCode(HttpStatus.CREATED)
	@Post('register')
	public register(
		@Body() data: RegisterRequestDto
	): Promise<TokensResponseDto> {
		return this.authService.register(data);
	}

	@ApiOperation({
		summary: 'Login to account',
		description: 'Login to account'
	})
	@ApiOkResponse({
		description: 'return refresh & access tokens',
		type: TokensResponseDto
	})
	@HttpCode(HttpStatus.OK)
	@Post('login')
	public login(@Body() data: LoginRequestDto): Promise<TokensResponseDto> {
		return this.authService.login(data);
	}
}
