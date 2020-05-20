import { Controller, Get, Post, UsePipes, ValidationPipe, Body, Param, Patch, Delete, UseInterceptors, UploadedFile, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../utils/file-upload.util';
import { diskStorage } from 'multer';
import { TokenGuard } from '../auth/token.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {

    constructor(private userService: UserService){}

    @Get()
    @UseGuards(TokenGuard, JwtAuthGuard)
    getAllUser(@Query('page') page: number, @Query('limit') limit: number){
        return this.userService.getAllUsers(page, limit);
    }

    @Post()
    @UseGuards(TokenGuard, JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    createUser(@Body() data: UserDTO){
        return this.userService.saveUser(data)
    }

    @Post(':id/image')
    @UseGuards(TokenGuard, JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('image', {
          storage: diskStorage({
            destination: './uploads/users',
            filename: editFileName,
          }),
          fileFilter: imageFileFilter,
        }),
      )
    createMovieImage(@Param('id') id: string, @UploadedFile() file){
       return this.userService.updateUser(id, { imagepath: file.path });
    }
    
    @Get(':id')
    @UseGuards(TokenGuard, JwtAuthGuard)
    getUser(@Param('id') id: string){
        return this.userService.getUser(id);
    }

    @Patch(':id')
    @UseGuards(TokenGuard, JwtAuthGuard)
    patchUser(@Param('id') id: string, @Body() data: Partial<UserDTO>){
        return this.userService.updateUser(id, data);
    }

    @Delete(':id')
    @UseGuards(TokenGuard, JwtAuthGuard)
     deleteUser(@Param('id') id: string){
        return this.userService.deleteUser(id);
     }


}
