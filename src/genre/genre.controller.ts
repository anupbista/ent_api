import { Controller, Get, Post, UsePipes, ValidationPipe, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreDTO } from './genre.dto';
import { TokenGuard } from '../auth/token.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('genre')
export class GenreController {

    constructor(private genreService: GenreService){}

    @Get()
    @UseGuards(TokenGuard, JwtAuthGuard)
    getAllGenre(@Query('page') page: number, @Query('limit') limit: number){
        return this.genreService.getAllGenres(page, limit);
    }

    @Post()
    @UseGuards(TokenGuard, JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    createMovie(@Body() data: GenreDTO){
        return this.genreService.saveGenre(data)
    }

    @Get(':id')
    @UseGuards(TokenGuard, JwtAuthGuard)
    getMovie(@Param('id') id: string){
        return this.genreService.getGenre(id);
    }

    @Patch(':id')
    @UseGuards(TokenGuard, JwtAuthGuard)
    patchMovie(@Param('id') id: string, @Body() data: Partial<GenreDTO>){
        return this.genreService.updateGenre(id, data);
    }

    @Delete(':id')
    @UseGuards(TokenGuard, JwtAuthGuard)
     deleteMovie(@Param('id') id: string){
        return this.genreService.deleteGenre(id);
     }

}
