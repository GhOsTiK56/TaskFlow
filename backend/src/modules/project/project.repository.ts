import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/generated/client';
import { CreateProjectInput, UpdateProjectInput } from './types';

@Injectable()
export class ProjectRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async create(data: CreateProjectInput): Promise<Project> {
		return await this.prismaService.project.create({
			data
		});
	}

	public async findOne(id: string): Promise<Project> {
		return await this.prismaService.project.findFirst({
			where: {
				id,
				deletedAt: null
			}
		});
	}

	public async findAll(userId: string): Promise<Project[]> {
		return await this.prismaService.project.findMany({
			where: {
				userId,
				deletedAt: null
			}
		});
	}

	public async update(data: UpdateProjectInput): Promise<Project> {
		const { id, userId, ...updateData } = data;

		return await this.prismaService.project.update({
			where: {
				id: id,
				userId
			},
			data: {
				...updateData
			}
		});
	}

	public async delete(userId: string, id: string): Promise<void> {
		await this.prismaService.$transaction([
			this.prismaService.task.updateMany({
				where: {
					projectId: id,
					deletedAt: null
				},
				data: {
					deletedAt: new Date()
				}
			}),

			this.prismaService.project.update({
				where: {
					id,
					userId
				},
				data: {
					deletedAt: new Date()
				}
			})
		]);
	}
}
