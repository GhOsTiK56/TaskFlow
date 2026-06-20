import { JwtAuthGuard } from '@/modules/auth/guards';
import { applyDecorators, UseGuards } from '@nestjs/common';

export function Protected() {
	return applyDecorators(UseGuards(JwtAuthGuard));
}
