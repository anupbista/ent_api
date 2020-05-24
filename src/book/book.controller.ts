import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	Param,
	UseInterceptors,
	UploadedFile,
	UsePipes,
	UseGuards,
	Query
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookDTO } from './book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/file-upload.util';
import { ValidationPipe } from '../shared/validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TokenGuard } from '../auth/token.guard';
import {
	ApiTags,
	ApiOkResponse,
	ApiUnauthorizedResponse,
	ApiBody,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiQuery
} from '@nestjs/swagger';

@Controller('books')
export class BookController {
	constructor(private bookService: BookService) {}

	@Get()
	@ApiTags('Books')
	@ApiOkResponse({ description: 'Success' })
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number
	})
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number
	})
	@ApiQuery({
		name: 'search',
		required: false,
		type: Number
	})
	getAllBooks(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
		return this.bookService.getAllBooks(page, limit, search);
	}

	@Get('/latest')
	@ApiTags('Books')
	@ApiOkResponse({ description: 'Success' })
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number
	})
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number
	})
	getLastestMovies(@Query('page') page: number, @Query('limit') limit: number) {
		return this.bookService.getLastestBooks(page, limit);
	}

	@Get('/popular')
	@ApiTags('Books')
	@ApiOkResponse({ description: 'Success' })
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number
	})
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number
	})
	getPopularMovies(@Query('page') page: number, @Query('limit') limit: number) {
		return this.bookService.getPopularBooks(page, limit);
	}

	@Get('/dashboard')
    @UseGuards(TokenGuard, JwtAuthGuard)
    @ApiTags('Book')
    @ApiOkResponse({ description: 'Success' })
    @ApiBearerAuth('Authorization')
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    getBookDashboard(){
        return this.bookService.getBookDashboard();
    }

	@Post(':id/image')
	@ApiTags('Books')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@UseGuards(TokenGuard, JwtAuthGuard)
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: './uploads/books',
				filename: editFileName
			}),
			fileFilter: imageFileFilter
		})
	)
	createBookImage(@Param('id') id: string, @UploadedFile() file) {
		return this.bookService.updateBook(id, { imagepath: file.path });
	}

	@Post()
	@UseGuards(TokenGuard, JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@ApiTags('Books')
	@ApiCreatedResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: BookDTO })
	createBook(@Body() data: BookDTO) {
		return this.bookService.saveBook(data);
	}

	@Get(':id')
	@ApiTags('Books')
	@ApiOkResponse({ description: 'Success' })
	getBook(@Param('id') id: string) {
		return this.bookService.getBook(id);
	}

	@Patch(':id')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('Books')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: BookDTO })
	patchBook(@Param('id') id: string, @Body() data: Partial<BookDTO>) {
		return this.bookService.updateBook(id, data);
	}

	@Delete(':id')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('Books')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: BookDTO })
	deleteBook(@Param('id') id: string) {
		return this.bookService.deleteBook(id);
	}
}
