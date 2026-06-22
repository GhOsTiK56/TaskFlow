import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/generated/client';

@Injectable()
export class UserRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async create(data: {
		email: string;
		password: string;
		name?: string;
	}): Promise<User> {
		return await this.prismaService.user.create({
			data: {
				email: data.email,
				password: data.password,
				name: data.name
			}
		});
	}

	public async findByEmail(email: string): Promise<User | null> {
		return await this.prismaService.user.findUnique({
			where: {
				email
			}
		});
	}

	public async findById(userId: string): Promise<User | null> {
		return await this.prismaService.user.findUnique({
			where: {
				id: userId
			}
		});
	}

	public async delete(userId: string) {
		return await this.prismaService.user.delete({
			where: {
				id: userId
			}
		});
	}
}
