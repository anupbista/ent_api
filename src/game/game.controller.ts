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
import { GameService } from './game.service';
import { GameDTO } from './game.dto';
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

@Controller('games')
export class GameController {
	constructor(private gameService: GameService) {}

	@Get()
	@ApiTags('Games')
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
		name: 'category',
		required: false,
		type: String
	})
	getAllGames(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string, @Query('category') category: string) {
		return this.gameService.getAllGames(page, limit, search, category);
	}

	@Get('/latest')
	@ApiTags('Games')
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
	getLastestGames(@Query('page') page: number, @Query('limit') limit: number) {
		return this.gameService.getLastestGames(page, limit);
	}

	@Get('/popular')
	@ApiTags('Games')
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
	getPopularGames(@Query('page') page: number, @Query('limit') limit: number) {
		return this.gameService.getPopularGames(page, limit);
	}

	@Get('/upcoming')
	@ApiTags('Games')
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
	getUpcomingGames(@Query('page') page: number, @Query('limit') limit: number) {
		return this.gameService.getUpcomingGames(page, limit);
	}

	@Get('/toprated')
	@ApiTags('Games')
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
	getTopRatedGames(@Query('page') page: number, @Query('limit') limit: number) {
		return this.gameService.getTopRatedGames(page, limit);
	}

	@Get('/dashboard')
    @UseGuards(TokenGuard, JwtAuthGuard)
    @ApiTags('Games')
    @ApiOkResponse({ description: 'Success' })
    @ApiBearerAuth('Authorization')
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    getGameDashboard(){
        return this.gameService.getGameDashboard();
    }

	@Post(':id/image')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('Games')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: './uploads/games',
				filename: editFileName
			}),
			fileFilter: imageFileFilter
		})
	)
	createGameImage(@Param('id') id: string, @UploadedFile() file) {
		return this.gameService.updateGame(id, { imagepath: file.path });
	}

	@Post()
	@UseGuards(TokenGuard, JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@ApiTags('Games')
	@ApiCreatedResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: GameDTO })
	createGame(@Body() data: GameDTO) {
		return this.gameService.saveGame(data);
	}

	@Get(':id')
	@ApiTags('Games')
	@ApiOkResponse({ description: 'Success' })
	getGame(@Param('id') id: string) {
		return this.gameService.getGame(id);
	}

	@Patch(':id')
	@ApiTags('Games')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: GameDTO })
	patchGame(@Param('id') id: string, @Body() data: Partial<GameDTO>) {
		return this.gameService.updateGame(id, data);
	}

	@Delete(':id')
	@ApiTags('Games')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@UseGuards(TokenGuard, JwtAuthGuard)
	deleteGame(@Param('id') id: string) {
		return this.gameService.deleteGame(id);
	}
}
