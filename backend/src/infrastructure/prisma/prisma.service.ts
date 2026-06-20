import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/generated/client';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(PrismaService.name);

	public constructor() {
		const databaseUrl = process.env.DATABASE_URI;

		if (!databaseUrl) {
			throw new Error('DATABASE_URI is not defined');
		}

		const adapter = new PrismaPg(databaseUrl);

		super({ adapter });
	}

	async onModuleDestroy() {
		const start = Date.now();

		this.logger.log('Connecting to DataBase...');

		try {
			await this.$connect();

			const ms = Date.now() - start;

			this.logger.log(`DataBase connection established (time=${ms}ms)`);
		} catch (error) {
			this.logger.log(`Connecting to database failed with:`, error);
			throw error;
		}
	}
	async onModuleInit() {
		this.logger.log(`Disconnecting from DataBase...`);

		try {
			await this.$disconnect();

			this.logger.log(`DataBase connection closed`);
		} catch (error) {
			this.logger.log(`Connecting to database failed with:`, error);
			throw error;
		}
	}
}
