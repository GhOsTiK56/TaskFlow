import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import ms, { StringValue } from 'ms';

@Injectable()
export class AuthRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findTokenByJti(jti: string) {
		return this.prismaService.refreshToken.findUnique({
			where: {
				jti
			}
		});
	}

	public async saveRefreshToken(
		userId: string,
		token: string,
		jti: string,
		ttl: StringValue
	): Promise<void> {
		const tokenHash = this.hashToken(token);
		const expiresAt = new Date(Date.now() + ms(ttl));

		await this.prismaService.refreshToken.create({
			data: {
				userId,
				jti,
				tokenHash,
				expiresAt
			}
		});
	}

	public async revokeToken(tokenId: string): Promise<void> {
		await this.prismaService.refreshToken.update({
			where: { id: tokenId },
			data: { revoked: true }
		});
	}

	public async revokeAllUserTokens(userId: string): Promise<void> {
		await this.prismaService.refreshToken.updateMany({
			where: {
				userId,
				revoked: false
			},
			data: { revoked: true }
		});
	}

	public hashToken(token: string): string {
		return createHash('sha256').update(token).digest('hex');
	}
}
