import {
	ConflictException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { OkResponseDto, TokensResponseDto } from './dto';
import { verify } from 'argon2';
import { hash } from 'argon2';
import { AuthRepository } from './auth.repository';
import { LoginUserInput, RegisterUserInput } from './types';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
	public constructor(
		private readonly userService: UserService,
		private readonly authRepository: AuthRepository,
		private readonly tokenService: TokenService
	) {}

	public async register(data: RegisterUserInput): Promise<TokensResponseDto> {
		const userIsExist = await this.userService.findByEmail(data.email);

		if (userIsExist) {
			throw new ConflictException('User already exits');
		}

		const hashedPassword = await hash(data.password);

		const user = await this.userService.create({
			email: data.email,
			password: hashedPassword,
			name: data.name
		});

		return this.tokenService.generateTokens(user.id);
	}

	public async login(data: LoginUserInput): Promise<TokensResponseDto> {
		const user = await this.userService.findByEmail(data.email);

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const isValidPassword = await verify(user.password, data.password);

		if (!isValidPassword) {
			throw new UnauthorizedException('Invalid credentials');
		}

		await this.authRepository.revokeAllUserTokens(user.id);

		return this.tokenService.generateTokens(user.id);
	}

	public async refresh(refreshToken: string): Promise<TokensResponseDto> {
		return await this.tokenService.refresh(refreshToken);
	}

	public async logout(userId: string): Promise<OkResponseDto> {
		if (!userId) {
			throw new UnauthorizedException('User ID is required for logout');
		}

		await this.authRepository.revokeAllUserTokens(userId);

		return { message: 'ok' };
	}
}
