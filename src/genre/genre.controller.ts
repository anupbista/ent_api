import {
	Controller,
	Get,
	Post,
	UsePipes,
	ValidationPipe,
	Body,
	Param,
	Patch,
	Delete,
	UseGuards,
	Query
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreDTO } from './genre.dto';
import { TokenGuard } from '../auth/token.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
	ApiCreatedResponse,
	ApiTags,
	ApiOkResponse,
	ApiBearerAuth,
	ApiUnauthorizedResponse,
	ApiBody,
	ApiQuery
} from '@nestjs/swagger';

@Controller('genre')
export class GenreController {
	constructor(private genreService: GenreService) {}

	@Get()
	// @UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('Genre')
	@ApiOkResponse({ description: 'Success' })
	// @ApiBearerAuth('Authorization')
	// @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
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
		name: "search",
		required: false,
		type: Number
	  })
	getAllGenre(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
		return this.genreService.getAllGenres(page, limit, search);
	}

	@Get('/dashboard')
    @UseGuards(TokenGuard, JwtAuthGuard)
    @ApiTags('Genre')
    @ApiOkResponse({ description: 'Success' })
    @ApiBearerAuth('Authorization')
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    getGenreDashboard(){
        return this.genreService.getGenreDashboard();
    }

	@Post()
	@UseGuards(TokenGuard, JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@ApiTags('Genre')
	@ApiCreatedResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiBody({ type: GenreDTO })
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	createMovie(@Body() data: GenreDTO) {
		return this.genreService.saveGenre(data);
	}

	@Get(':id')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('Genre')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	getMovie(@Param('id') id: string) {
		return this.genreService.getGenre(id);
	}

	@Patch(':id')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('Genre')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	patchMovie(@Param('id') id: string, @Body() data: Partial<GenreDTO>) {
		return this.genreService.updateGenre(id, data);
	}

	@Delete(':id')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('Genre')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	deleteMovie(@Param('id') id: string) {
		return this.genreService.deleteGenre(id);
	}
}
