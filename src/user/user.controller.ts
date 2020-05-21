import { Controller, Get, Post, UsePipes, ValidationPipe, Body, Param, Patch, Delete, UseInterceptors, UploadedFile, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../utils/file-upload.util';
import { diskStorage } from 'multer';
import { TokenGuard } from '../auth/token.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiCreatedResponse, ApiBody, ApiTags, ApiOkResponse, ApiBearerAuth, ApiUnauthorizedResponse, ApiQuery } from '@nestjs/swagger';

@Controller('users')
export class UserController {

    constructor(private userService: UserService){}

    @Get()
    @UseGuards(TokenGuard, JwtAuthGuard)
    @ApiTags('Users')
    @ApiOkResponse({ description: 'Success' })
    @ApiBearerAuth('Authorization')
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    @ApiQuery({
      name: "limit",
      required: false,
      type: Number
    })
    @ApiQuery({
      name: "page",
      required: false,
      type: Number
    })
    @ApiQuery({
      name: "search",
      required: false,
      type: Number
      })
    getAllUser(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string){
        return this.userService.getAllUsers(page, limit, search);
    }

    @Post()
    @UseGuards(TokenGuard, JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @ApiTags('Users')
    @ApiCreatedResponse({ description: 'Success' })
    @ApiBearerAuth('Authorization')
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    @ApiBody({ type: UserDTO })
    createUser(@Body() data: UserDTO){
        return this.userService.saveUser(data)
    }

    @Post(':id/image')
    @UseGuards(TokenGuard, JwtAuthGuard)
    @ApiTags('Users')
    @ApiOkResponse({ description: 'Success' })
    @ApiBearerAuth('Authorization')
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
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
    @ApiTags('Users')
    @ApiOkResponse({ description: 'Success' })
    @ApiBearerAuth('Authorization')
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    getUser(@Param('id') id: string){
        return this.userService.getUser(id);
    }

    @Patch(':id')
    @UseGuards(TokenGuard, JwtAuthGuard)
    @ApiTags('Users')
    @ApiOkResponse({ description: 'Success' })
    @ApiBearerAuth('Authorization')
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    patchUser(@Param('id') id: string, @Body() data: Partial<UserDTO>){
        return this.userService.updateUser(id, data);
    }

    @Delete(':id')
    @UseGuards(TokenGuard, JwtAuthGuard)
    @ApiTags('Users')
    @ApiOkResponse({ description: 'Success' })
    @ApiBearerAuth('Authorization')
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
     deleteUser(@Param('id') id: string){
        return this.userService.deleteUser(id);
     }


}
