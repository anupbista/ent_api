import { Controller, Body, Post, Get, Param, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenGuard } from './token.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiOkResponse, ApiUnauthorizedResponse, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDTO } from './auth.dto';
import { PasswordChangeDTO } from './passwordchange.dto';

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

	@Post('/passwordchange/:id')
	@ApiTags('Authentication')
	@ApiOkResponse({ description: 'Password Change' })
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: PasswordChangeDTO })
	async passwordchange(@Body() passwords: PasswordChangeDTO, @Param('id') id: string): Promise<any> {
		return this.authService.passwordChange(passwords, id);
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
