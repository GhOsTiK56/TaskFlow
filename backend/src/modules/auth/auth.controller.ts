import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
	LoginRequestDto,
	OkResponseDto,
	RefreshRequestDto,
	RegisterRequestDto,
	TokensResponseDto
} from './dto';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger';
import { CurrentUser, Protected } from '@/common';

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

	@Post('refresh')
	@ApiOperation({
		summary: 'Get new refresh and access tokens',
		description: 'Return new refresh and access tokens'
	})
	@ApiOkResponse({
		description: 'return access token',
		type: TokensResponseDto
	})
	public refresh(@Body() data: RefreshRequestDto): Promise<TokensResponseDto> {
		return this.authService.refresh(data.refreshToken);
	}

	@Post('logout')
	@ApiOperation({
		summary: 'Logout',
		description: 'Logout'
	})
	@ApiOkResponse({
		description: 'Logout',
		type: OkResponseDto
	})
	@ApiBearerAuth()
	@Protected()
	public logout(@CurrentUser() userId: string): Promise<OkResponseDto> {
		return this.authService.logout(userId);
	}
}
