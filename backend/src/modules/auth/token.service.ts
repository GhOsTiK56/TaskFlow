import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StringValue } from 'ms';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { JwtPayload } from './interfaces';
import { AuthRepository } from './auth.repository';
import { TokensResponseDto } from './dto';

@Injectable()
export class TokenService {
	private readonly JWT_ACCESS_TOKEN_TTL: StringValue;
	private readonly JWT_REFRESH_TOKEN_TTL: StringValue;

	public constructor(
		private readonly jwtService: JwtService,
		private readonly authRepository: AuthRepository,
		private readonly configService: ConfigService
	) {
		this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<StringValue>(
			'JWT_ACCESS_TOKEN_TTL'
		);
		this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<StringValue>(
			'JWT_REFRESH_TOKEN_TTL'
		);
	}

	public async generateTokens(userId: string): Promise<TokensResponseDto> {
		const jti = nanoid();
		const payload: JwtPayload = { id: userId, jti };

		const accessToken = this.jwtService.sign(
			{ id: userId },
			{ expiresIn: this.JWT_ACCESS_TOKEN_TTL }
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

	public async refresh(refreshToken: string): Promise<TokensResponseDto> {
		let payload: JwtPayload;
		const storedToken = await this.authRepository.findTokenByJti(payload.jti);

		try {
			payload = this.jwtService.verify<JwtPayload>(refreshToken);

			if (!payload?.id || !payload?.jti) {
				throw new UnauthorizedException('Invalid refresh token');
			}
		} catch {
			throw new UnauthorizedException('Invalid refresh token');
		}

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
}
