import { Controller, Get, Post, Patch, Delete, Body, Param, UseInterceptors, UploadedFile, UsePipes } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieDTO } from './movie.dto';
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/file-upload.util';
import { ValidationPipe } from '../shared/validation.pipe';

@Controller('movies')
export class MovieController {

    constructor(private movieService: MovieService){}

    @Get()
    getAllMovies(){
        return this.movieService.getAllMovies();
    }

    @Post(':id/image')
    @UseInterceptors(
        FileInterceptor('image', {
          storage: diskStorage({
            destination: './uploads/movies',
            filename: editFileName,
          }),
          fileFilter: imageFileFilter,
        }),
      )
    createMovieImage(@Param('id') id: string, @UploadedFile() file){
       return this.movieService.updateMovie(id, { imagepath: file.path });
    }

    @Post()
    @UsePipes(new ValidationPipe())
    createMovie(@Body() data: MovieDTO){
        return this.movieService.saveMovie(data)
    }

    @Get(':id')
    getMovie(@Param('id') id: string){
        return this.movieService.getMovie(id);
    }

    @Patch(':id')
    patchMovie(@Param('id') id: string, @Body() data: Partial<MovieDTO>){
        return this.movieService.updateMovie(id, data);
    }

    @Delete(':id')
     deleteMovie(@Param('id') id: string){
        return this.movieService.deleteMovie(id);
     }

}
