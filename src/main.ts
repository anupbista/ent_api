import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

const port = process.env.PORT || 8080;

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const cors_options = {
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        "preflightContinue": false,
        "optionsSuccessStatus": 204,
		"credentials":true,
		"allowedHeaders": "Content-Type, Accept, Origin, Authorization, X-Requested-With",
    }
	app.enableCors(cors_options);
	app.setGlobalPrefix('api/v1');
	app.useStaticAssets(join(__dirname, 'uploads'));
	const options = new DocumentBuilder()
		.setTitle('Ent API')
		.setDescription('API for Ent')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document);

	await app.listen(port);

	Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
