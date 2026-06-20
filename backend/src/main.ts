/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: {
				enableImplicitConversion: true
			}
		})
	);

	const configSwagger = new DocumentBuilder()
		.setTitle('TaskFlow API')
		.setDescription('API documentation for TaskFlow')
		.setVersion('1.0.0')
		.setContact(
			'Ghostik',
			'https://github.com/GhOsTiK56/TaskFlow',
			'karenheister5@gmail.com'
		)
		.addBearerAuth()
		.addTag('Auth', 'Operations related to user authentication')
		.addTag('Projects', 'Project management endpoints')
		.addTag('Tasks', 'Task tracking and assignment')
		.addTag('Tags', 'Labels for task categorization')
		.build();

	const documentFactory = () =>
		SwaggerModule.createDocument(app, configSwagger);

	SwaggerModule.setup('/docs', app, documentFactory, {
		customSiteTitle: 'TaskFlow API',
		jsonDocumentUrl: '/docs-json',
		swaggerOptions: {
			persistAuthorization: true,
			docExpansion: 'none',
			displayRequestDuration: true
		}
	});

	const config = app.get(ConfigService);
	const logger = new Logger();
	const port = config.getOrThrow<number>('HTTP_PORT');
	const host = config.getOrThrow<string>('HTTP_HOST');

	await app.listen(port ?? 3000);

	logger.log(`App started on ${host}`);
	logger.log(`Swagger: ${host}/docs`);
}
bootstrap();
