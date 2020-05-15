import { Controller, Body, Post, Get, Param, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/user.dto';
import { TokenGuard } from './token.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('/login')
    async login(@Body() user: UserDTO): Promise<any> {
      return this.authService.login(user);
    }

    @Get('/logout/:id')
    @UseGuards(TokenGuard, JwtAuthGuard)
    async logout(@Param('id') id: string, @Headers() headers){
     let token = headers.authorization.split(' ')[1]
     return this.authService.logout(id, token);
    }

}
