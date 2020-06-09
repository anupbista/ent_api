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
	Query,
	Headers,
	Res
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
import * as jwt_decode from 'jwt-decode';
import { ReadStream } from 'fs';
import * as fs from 'fs';

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

	@Get('/report')
	@ApiTags('Books')
	@ApiOkResponse({ description: 'Success' })
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
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
	async getReport(@Query('page') page: number, @Query('limit') limit: number, @Headers() headers, @Res() response) {
		let token = headers.authorization.split(' ')[1];
		let decodedtoken = jwt_decode(token);
		let stream: ReadStream = await this.bookService.getReport(page, limit, decodedtoken.sub);
		let filename = stream.path;
		response.setHeader('Content-Disposition', `attachment; filename=${filename}`);
		response.contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		// This will wait until we know the readable stream is actually valid before piping
		stream.on('open', function () {
			// This just pipes the read stream to the response object (which goes to the client)
			return stream.pipe(response);
		});
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
	getLastestBooks(@Query('page') page: number, @Query('limit') limit: number) {
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
	getPopularBooks(@Query('page') page: number, @Query('limit') limit: number) {
		return this.bookService.getPopularBooks(page, limit);
	}

	@Get('/upcoming')
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
	getUpComingBooks(@Query('page') page: number, @Query('limit') limit: number) {
		return this.bookService.getUpComingBooks(page, limit);
	}

	@Get('/toprated')
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
	getTopRatedBooks(@Query('page') page: number, @Query('limit') limit: number) {
		return this.bookService.getTopRatedBooks(page, limit);
	}

	@Get('/dashboard')
    @UseGuards(TokenGuard, JwtAuthGuard)
    @ApiTags('Books')
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
