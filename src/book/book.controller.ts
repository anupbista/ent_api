import { Controller, Get, Post, Patch, Delete, Body, Param, UseInterceptors, UploadedFile, UsePipes, UseGuards, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { BookDTO } from './book.dto';
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/file-upload.util';
import { ValidationPipe } from '../shared/validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TokenGuard } from '../auth/token.guard';

@Controller('books')
export class BookController {

    constructor(private bookService: BookService){}

    @Get()
    getAllBooks(@Query('page') page: number, @Query('limit') limit: number){
        return this.bookService.getAllBooks(page, limit);
    }

    @Post(':id/image')
    @UseGuards(TokenGuard, JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('image', {
          storage: diskStorage({
            destination: './uploads/books',
            filename: editFileName,
          }),
          fileFilter: imageFileFilter,
        }),
      )
    createBookImage(@Param('id') id: string, @UploadedFile() file){
       return this.bookService.updateBook(id, { imagepath: file.path });
    }

    @Post()
    @UseGuards(TokenGuard, JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    createBook(@Body() data: BookDTO){
        return this.bookService.saveBook(data)
    }

    @Get(':id')
    getBook(@Param('id') id: string){
        return this.bookService.getBook(id);
    }

    @Patch(':id')
    @UseGuards(TokenGuard, JwtAuthGuard)
    patchBook(@Param('id') id: string, @Body() data: Partial<BookDTO>){
        return this.bookService.updateBook(id, data);
    }

    @Delete(':id')
    @UseGuards(TokenGuard, JwtAuthGuard)
     deleteBook(@Param('id') id: string){
        return this.bookService.deleteBook(id);
     }

}
