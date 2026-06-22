import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { OkResponseDto, TokensResponseDto } from './dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { nanoid } from 'nanoid';
import { hash } from 'argon2';
import { JwtPayload } from './interfaces';
import { AuthRepository } from './auth.repository';
import { LoginUserInput, RegisterUserInput } from './types';

@Injectable()
export class AuthService {
	private readonly JWT_ACCESS_TOKEN_TTL: StringValue;
	private readonly JWT_REFRESH_TOKEN_TTL: StringValue;

	public constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly authRepository: AuthRepository
	) {
		this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<StringValue>(
			'JWT_ACCESS_TOKEN_TTL'
		);
		this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<StringValue>(
			'JWT_REFRESH_TOKEN_TTL'
		);
	}

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

		return this.generateTokens(user.id);
	}

	public async login(data: LoginUserInput): Promise<TokensResponseDto> {
		const user = await this.userService.findByEmail(data.email);

		if (!user) {
			throw new NotFoundException('Invalid credentials');
		}

		const isValidPassword = await verify(user.password, data.password);

		if (!isValidPassword) {
			throw new UnauthorizedException('Incorrect password');
		}

		await this.authRepository.revokeAllUserTokens(user.id);

		return this.generateTokens(user.id);
	}

	public async refresh(refreshToken: string): Promise<TokensResponseDto> {
		let payload: JwtPayload;

		try {
			payload = this.jwtService.verify<JwtPayload>(refreshToken);

			if (!payload?.id || !payload?.jti) {
				throw new UnauthorizedException('Invalid refresh token');
			}
		} catch {
			throw new UnauthorizedException('Invalid refresh token');
		}

		const storedToken = await this.authRepository.findTokenByJti(payload.jti);

		if (!storedToken) {
			throw new UnauthorizedException('Refresh token not found');
		}

		if (storedToken.revoked) {
			await this.authRepository.revokeAllUserTokens(storedToken.userId);
			throw new UnauthorizedException(
				'Compromised token detected. All sessions revoked.'
			);
		}

		if (storedToken.expiresAt < new Date()) {
			throw new UnauthorizedException('Refresh token expired');
		}

		const incomingHash = this.authRepository.hashToken(refreshToken);
		if (storedToken.tokenHash !== incomingHash) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		await this.authRepository.revokeToken(storedToken.id);

		return this.generateTokens(payload.id);
	}

	public async logout(userId: string): Promise<OkResponseDto> {
		if (!userId) {
			throw new UnauthorizedException('User ID is required for logout');
		}

		await this.authRepository.revokeAllUserTokens(userId);

		return { message: 'ok' };
	}

	private async generateTokens(userId: string): Promise<TokensResponseDto> {
		const jti = nanoid();

		const payload: JwtPayload = { id: userId, jti };

		const accessToken = this.jwtService.sign(
			{ id: userId },
			{
				expiresIn: this.JWT_ACCESS_TOKEN_TTL
			}
		);

		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: this.JWT_REFRESH_TOKEN_TTL
		});

		await this.authRepository.saveRefreshToken(
			userId,
			refreshToken,
			jti,
			this.JWT_REFRESH_TOKEN_TTL
		);

		return {
			accessToken,
			refreshToken
		};
	}
}
