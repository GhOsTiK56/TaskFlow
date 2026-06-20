import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterRequestDto, TokensResponseDto } from './dto';
import { LoginRequestDto } from './dto/requests/login.request.dto';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
	public constructor(private readonly userService: UserService) {}

	public async register(data: RegisterRequestDto): Promise<TokensResponseDto> {
		const userIsExist = await this.userService.findByEmail(data.email);

		if (userIsExist) {
			throw new ConflictException('User already exits');
		}

		await this.userService.create({
			email: data.email,
			password: data.password,
			name: data.name
		});

		return { accessToken: 'accessToken', refreshToken: 'refreshToken' };
	}

	public async login(data: LoginRequestDto): Promise<TokensResponseDto> {
		const user = await this.userService.findByEmail(data.email);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const isValidPassword = await verify(user.password, data.password);

		if (!isValidPassword) {
			throw new UnauthorizedException('Incorrect password');
		}

		return { accessToken: 'accessToken', refreshToken: 'refreshToken' };
	}
}
