import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CurrentUser, Protected } from '@/common';
import {
	CreateProjectRequestDto,
	ProjectResponseDto,
	UpdateProjectRequestDto
} from './dto';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger';
import { ErrorResponseDto } from '@/common/dto';
import { OkResponseDto } from '../auth/dto';

@Protected()
@ApiBearerAuth()
@Controller('project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Create project',
		description: 'Create project'
	})
	@ApiCreatedResponse({
		description: 'Project successfully created',
		type: ProjectResponseDto
	})
	@ApiBadRequestResponse({
		description: 'Creating failed',
		type: ErrorResponseDto
	})
	@ApiConflictResponse({
		description: 'Tag with this name already exists',
		type: ErrorResponseDto
	})
	public create(
		@CurrentUser() userId: string,
		@Body() data: CreateProjectRequestDto
	): Promise<ProjectResponseDto> {
		return this.projectService.create(userId, data);
	}

	@Get()
	@ApiOperation({
		summary: 'Get a list of projects',
		description: 'Retrieves the list of created projects'
	})
	@ApiOkResponse({
		description: 'Retrieves the list of created projects',
		type: ProjectResponseDto,
		isArray: true
	})
	@HttpCode(HttpStatus.OK)
	public findAll(@CurrentUser() userId: string): Promise<ProjectResponseDto[]> {
		return this.projectService.findAll(userId);
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Updates the project',
		description: 'Updates the project and returns it with the updated fields'
	})
	@ApiOkResponse({
		description: 'Updates the project and returns it with the updated fields',
		type: ProjectResponseDto
	})
	public update(
		@CurrentUser() userId: string,
		@Param('id') id: string,
		@Body() data: UpdateProjectRequestDto
	): Promise<ProjectResponseDto> {
		return this.projectService.update(userId, id, data);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Delete the project',
		description: 'Delete the project and returns ok message'
	})
	@ApiOkResponse({
		description: 'Delete the project and returns ok message',
		type: OkResponseDto
	})
	public delete(
		@CurrentUser() userId: string,
		@Param('id') id: string
	): Promise<OkResponseDto> {
		return this.projectService.delete(userId, id);
	}
}
