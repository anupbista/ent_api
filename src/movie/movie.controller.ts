import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	Headers,
	Param,
	UseInterceptors,
	UploadedFile,
	UsePipes,
	UseGuards,
	Query,
	Res,
	Header
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieDTO } from './movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/file-upload.util';
import { ValidationPipe } from '../shared/validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TokenGuard } from '../auth/token.guard';
import {
	ApiTags,
	ApiOkResponse,
	ApiBearerAuth,
	ApiUnauthorizedResponse,
	ApiCreatedResponse,
	ApiBody,
	ApiQuery
} from '@nestjs/swagger';
import * as jwt_decode from 'jwt-decode';
import { pipe } from 'rxjs';

@Controller('movies')
export class MovieController {
	constructor(private movieService: MovieService) {}

	@Get()
	@ApiTags('Movies')
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
		type: String
	})
	@ApiQuery({
		name: 'genre',
		required: false,
		type: String
	})
	@ApiQuery({
		name: 'country',
		required: false,
		type: String
	})
	getAllMovies(
		@Query('page') page: number,
		@Query('limit') limit: number,
		@Query('search') search: string,
		@Query('genre') genre: string,
		@Query('country') country: string
	) {
		return this.movieService.getAllMovies(page, limit, search, genre, country);
	}

	@Get('/report')
	@ApiTags('Movies')
	@Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
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
	async getReport(@Query('page') page: number, @Query('limit') limit: number, @Headers() headers, @Res() response) {
		let token = headers.authorization.split(' ')[1];
		let decodedtoken = jwt_decode(token);
		let stream = await this.movieService.getReport(page, limit, decodedtoken.sub);
		response.setHeader('Content-disposition', `attachment;filename=data.xls`);
		response.setHeader('Content-type', 'application/vnd.ms-excel');
		return stream.pipe(response);
	}

	@Get('/latest')
	@ApiTags('Movies')
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
		return this.movieService.getLastestMovies(page, limit);
	}

	@Get('/popular')
	@ApiTags('Movies')
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
		return this.movieService.getPopularMovies(page, limit);
	}

	@Get('/upcoming')
	@ApiTags('Movies')
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
	getUpcomingMovies(@Query('page') page: number, @Query('limit') limit: number) {
		return this.movieService.getUpcomingMovies(page, limit);
	}

	@Get('/toprated')
	@ApiTags('Movies')
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
	getTopRatedMovies(@Query('page') page: number, @Query('limit') limit: number) {
		return this.movieService.getTopRatedMovies(page, limit);
	}

	@Get('/dashboard')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('Movies')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	getMovieDashboard() {
		return this.movieService.getMovieDashboard();
	}

	@Post(':id/image')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('Movies')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: './uploads/movies',
				filename: editFileName
			}),
			fileFilter: imageFileFilter
		})
	)
	createMovieImage(@Param('id') id: string, @UploadedFile() file) {
		return this.movieService.updateMovie(id, { imagepath: file.path });
	}

	@Post()
	@UseGuards(TokenGuard, JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@ApiTags('Movies')
	@ApiCreatedResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: MovieDTO })
	createMovie(@Body() data: MovieDTO) {
		return this.movieService.saveMovie(data);
	}

	@Get(':id')
	@ApiTags('Movies')
	@ApiOkResponse({ description: 'Success' })
	getMovie(@Param('id') id: string) {
		return this.movieService.getMovie(id);
	}

	@Patch(':id')
	@ApiTags('Movies')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: MovieDTO })
	patchMovie(@Param('id') id: string, @Body() data: Partial<MovieDTO>) {
		return this.movieService.updateMovie(id, data);
	}

	@Delete(':id')
	@ApiTags('Movies')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@UseGuards(TokenGuard, JwtAuthGuard)
	deleteMovie(@Param('id') id: string) {
		return this.movieService.deleteMovie(id);
	}
}
