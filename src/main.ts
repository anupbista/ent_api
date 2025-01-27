import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
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
		"exposedHeaders": "Content-Disposition"
    }
	app.enableCors(cors_options);
	app.setGlobalPrefix('api/v1');
	app.useStaticAssets(join(__dirname, '../uploads'));
	app.useGlobalPipes(new ValidationPipe({
		disableErrorMessages: false,
	  }));
	const options = new DocumentBuilder()
		.setTitle('trends API')
		.setDescription('API for trends')
		.setVersion('1.0')
		.addBearerAuth({
			type: 'http', scheme: 'bearer', bearerFormat: 'JWT'}, 'Authorization'
		)
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document);

	await app.listen(port);

	Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
