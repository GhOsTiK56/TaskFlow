import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { ProjectResponseDto } from './dto';
import { OkResponseDto } from '../auth/dto';
import { Project } from '@prisma/generated/client';
import { plainToInstance } from 'class-transformer';
import type { CreateProjectInput, UpdateProjectInput } from './types';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService {
	public constructor(private readonly projectRepository: ProjectRepository) {}

	public async create(data: CreateProjectInput): Promise<ProjectResponseDto> {
		const project = await this.projectRepository.create(data);

		return this.mapToDto(project);
	}

	public async findAll(userId: string): Promise<ProjectResponseDto[]> {
		const projects = await this.projectRepository.findAll(userId);

		return projects.map((project) => this.mapToDto(project));
	}

	public async update(data: UpdateProjectInput): Promise<ProjectResponseDto> {
		const project = await this.projectRepository.findOne(data.id);

		if (!project) {
			throw new NotFoundException('Project not found');
		}

		if (project.userId !== data.userId) {
			throw new ForbiddenException('Invalid credentials');
		}

		const updatedProject = await this.projectRepository.update(data);

		return this.mapToDto(updatedProject);
	}

	public async delete(userId: string, id: string): Promise<OkResponseDto> {
		const project = await this.projectRepository.findOne(id);

		if (!project) {
			throw new NotFoundException('Project not found');
		}

		if (project.userId !== userId) {
			throw new ForbiddenException('Invalid credentials');
		}
		await this.projectRepository.delete(userId, id);

		return { message: 'ok' };
	}

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
}
