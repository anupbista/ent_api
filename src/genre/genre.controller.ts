import { Controller, Get, Post, UsePipes, ValidationPipe, Body, Param, Patch, Delete } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreDTO } from './genre.dto';

@Controller('genre')
export class GenreController {

    constructor(private genreService: GenreService){}

    @Get()
    getAllGenre(){
        return this.genreService.getAllGenres();
    }

    @Post()
    @UsePipes(new ValidationPipe())
    createMovie(@Body() data: GenreDTO){
        return this.genreService.saveGenre(data)
    }

    @Get(':id')
    getMovie(@Param('id') id: string){
        return this.genreService.getGenre(id);
    }

    @Patch(':id')
    patchMovie(@Param('id') id: string, @Body() data: Partial<GenreDTO>){
        return this.genreService.updateGenre(id, data);
    }

    @Delete(':id')
     deleteMovie(@Param('id') id: string){
        return this.genreService.deleteGenre(id);
     }

}
