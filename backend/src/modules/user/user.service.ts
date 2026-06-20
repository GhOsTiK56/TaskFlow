import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async create(data: {
		email: string;
		password: string;
		name?: string;
	}) {
		return await this.prismaService.user.create({
			data: {
				email: data.email,
				password: data.password,
				name: data.name
			}
		});
	}

	public async findByEmail(email: string) {
		return await this.prismaService.user.findUnique({
			where: {
				email: email
			}
		});
	}

	public async findById(userId: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId
			}
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	public async delete(userId: string) {
		await this.prismaService.user.delete({
			where: {
				id: userId
			}
		});

		return { message: 'ok' };
	}
}
