import { Injectable, NotFoundException } from '@nestjs/common';
import { OkResponseDto } from '../auth/dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
	public constructor(private readonly userRepository: UserRepository) {}

	public async create(data: {
		email: string;
		password: string;
		name?: string;
	}) {
		return await this.userRepository.create(data);
	}

	public async findByEmail(email: string) {
		return await this.userRepository.findByEmail(email);
	}

	public async findById(userId: string) {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return {
			email: user.email,
			name: user.name || undefined
		};
	}

	public async delete(userId: string): Promise<OkResponseDto> {
		await this.userRepository.delete(userId);

		return { message: 'ok' };
	}
}
