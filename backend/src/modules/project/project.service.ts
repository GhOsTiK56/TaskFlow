import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
	CreateProjectRequestDto,
	ProjectResponseDto,
	UpdateProjectRequestDto
} from './dto';
import { OkResponseDto } from '../auth/dto';
import { Project } from '@prisma/generated/client';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProjectService {
	public constructor(private readonly prismaService: PrismaService) {}

	private mapToDto(project: Project): ProjectResponseDto {
		return plainToInstance(
			ProjectResponseDto,
			{
				id: project.id,
				name: project.name,
				description: project.description || undefined,
				color: project.color || undefined,
				icon: project.icon || undefined,
				createdAt: project.createdAt,
				updatedAt: project.updatedAt
			},
			{
				excludeExtraneousValues: true
			}
		);
	}

	public async create(
		userId: string,
		data: CreateProjectRequestDto
	): Promise<ProjectResponseDto> {
		const project = await this.prismaService.project.create({
			data: {
				userId,
				...data
			}
		});

		return this.mapToDto(project);
	}

	public async findAll(userId: string): Promise<ProjectResponseDto[]> {
		const projects = await this.prismaService.project.findMany({
			where: {
				userId: userId
			}
		});

		return projects.map((project) => this.mapToDto(project));
	}

	public async update(
		userId: string,
		id: string,
		data: UpdateProjectRequestDto
	): Promise<ProjectResponseDto> {
		const updatedProject = await this.prismaService.project.update({
			where: {
				userId,
				id
			},
			data: {
				...data
			}
		});

		return this.mapToDto(updatedProject);
	}

	// TODO: Надо сделать мягкое удаление, то есть в таблице просто вставлять время удаления проекта, а не удалять запись целиком
	public async delete(userId: string, id: string): Promise<OkResponseDto> {
		await this.prismaService.project.delete({
			where: {
				userId,
				id
			}
		});

		return { message: 'ok' };
	}
}
