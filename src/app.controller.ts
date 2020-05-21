import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@ApiTags('Default')
	@ApiOkResponse({ description: 'Success' })
	getHello(): string {
		return this.appService.getHello();
	}
}
