import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const port = process.env.PORT || 8080;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const cors_options = {
        "origin": true,
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204,
		"credentials":true,
		"allowedHeaders": "Content-Type, Accept, Origin, Authorization",
    }
	app.enableCors(cors_options);
	app.setGlobalPrefix('api/v1');

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
