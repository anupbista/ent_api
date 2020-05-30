import {
	Controller,
	Get,
	Post,
	Patch,Delete,
	Body,
	Param,
	UsePipes,
	UseGuards,
	Query
} from '@nestjs/common';
import { YouTubeVideoService } from './youtubevideo.service';
import { YouTubeVideoDTO } from './youtubevideo.dto';
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

@Controller('youtubevideos')
export class YouTubeVideoController {
	constructor(private youtubevideoService: YouTubeVideoService) {}

	@Get()
	@ApiTags('YouTubeVideos')
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
	getAllYouTubeVideos(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string, @Query('category') category: string) {
		return this.youtubevideoService.getAllYouTubeVideos(page, limit, search, category);
	}


	@Get('/dashboard')
    @UseGuards(TokenGuard, JwtAuthGuard)
    @ApiTags('YouTubeVideos')
    @ApiOkResponse({ description: 'Success' })
    @ApiBearerAuth('Authorization')
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    getYouTubeVideoDashboard(){
        return this.youtubevideoService.getYouTubeVideoDashboard();
    }

	@Post()
	@UseGuards(TokenGuard, JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@ApiTags('YouTubeVideos')
	@ApiCreatedResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: YouTubeVideoDTO })
	createYouTubeVideo(@Body() data: YouTubeVideoDTO) {
		return this.youtubevideoService.saveYouTubeVideo(data);
	}

	@Get(':id')
	@ApiTags('YouTubeVideos')
	@ApiOkResponse({ description: 'Success' })
	getYouTubeVideo(@Param('id') id: string) {
		return this.youtubevideoService.getYouTubeVideo(id);
	}

	@Patch(':id')
	@ApiTags('YouTubeVideos')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: YouTubeVideoDTO })
	patchYouTubeVideo(@Param('id') id: string, @Body() data: Partial<YouTubeVideoDTO>) {
		return this.youtubevideoService.updateYouTubeVideo(id, data);
	}

	@Delete(':id')
	@ApiTags('YouTubeVideos')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@UseGuards(TokenGuard, JwtAuthGuard)
	deleteYouTubeVideo(@Param('id') id: string) {
		return this.youtubevideoService.deleteYouTubeVideo(id);
	}
}
