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
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { CurrentUser, Protected } from '@/common';
import { ErrorResponseDto } from '@/common/dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Register user',
		description: 'Creates a new user account and returns JWT tokens'
	})
	@ApiCreatedResponse({
		description: 'User successfully registered',
		type: TokensResponseDto
	})
	@ApiBadRequestResponse({
		description: 'Validation failed',
		type: ErrorResponseDto
	})
	@ApiConflictResponse({
		description: 'User with this email already exists',
		type: ErrorResponseDto
	})
	public register(
		@Body() data: RegisterRequestDto
	): Promise<TokensResponseDto> {
		return this.authService.register(data);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Login to account',
		description: 'Authenticates user and returns JWT tokens'
	})
	@ApiOkResponse({
		description: 'Successfully authenticated',
		type: TokensResponseDto
	})
	@ApiBadRequestResponse({
		description: 'Validation error',
		type: ErrorResponseDto
	})
	@ApiUnauthorizedResponse({
		description: 'Invalid credentials',
		type: ErrorResponseDto
	})
	public login(@Body() data: LoginRequestDto): Promise<TokensResponseDto> {
		return this.authService.login(data);
	}

	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Refresh JWT tokens',
		description: 'Returns new access and refresh tokens using refresh token'
	})
	@ApiOkResponse({
		description: 'Tokens successfully refreshed',
		type: TokensResponseDto
	})
	@ApiBadRequestResponse({
		description: 'Invalid request body',
		type: ErrorResponseDto
	})
	@ApiUnauthorizedResponse({
		description: 'Invalid or expired refresh token',
		type: ErrorResponseDto
	})
	public refresh(@Body() data: RefreshRequestDto): Promise<TokensResponseDto> {
		return this.authService.refresh(data.refreshToken);
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@ApiBearerAuth()
	@Protected()
	@ApiOperation({
		summary: 'Logout user',
		description: 'Invalidates current user session or refresh token'
	})
	@ApiOkResponse({
		description: 'Successfully logged out',
		type: OkResponseDto
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: ErrorResponseDto
	})
	public logout(@CurrentUser() userId: string): Promise<OkResponseDto> {
		return this.authService.logout(userId);
	}
}
