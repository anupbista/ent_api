import { Controller, Body, Post, Get, Param, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenGuard } from './token.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiOkResponse, ApiUnauthorizedResponse, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/login')
	@ApiTags('Authentication')
	@ApiOkResponse({ description: 'User Login' })
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: AuthDTO })
	async login(@Body() user: AuthDTO): Promise<any> {
		return this.authService.login(user);
	}

	@Get('/logout/:id')
	@ApiTags('Authentication')
	@ApiBearerAuth('Authorization')
	@ApiOkResponse({ description: 'User Logout' })
	@UseGuards(TokenGuard, JwtAuthGuard)
	async logout(@Param('id') id: string, @Headers() headers) {
		let token = headers.authorization.split(' ')[1];
		return this.authService.logout(id, token);
	}
}
