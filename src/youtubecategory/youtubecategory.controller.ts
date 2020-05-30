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
import { YouTubeCategoryService } from './youtubecategory.service';
import { YouTubeCategoryDTO } from './youtubecategory.dto';
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

@Controller('youtubecategory')
export class YouTubeCategoryController {
	constructor(private youtubecategoryService: YouTubeCategoryService) {}

	@Get()
	// @UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('YouTubeCategory')
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
      getAllYouTubeCategory(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
		return this.youtubecategoryService.getAllYouTubeCategory(page, limit, search);
	}

	@Get('/dashboard')
    @UseGuards(TokenGuard, JwtAuthGuard)
    @ApiTags('YouTubeCategory')
    @ApiOkResponse({ description: 'Success' })
    @ApiBearerAuth('Authorization')
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    getYouTubeCategoryDashboard(){
        return this.youtubecategoryService.getYouTubeCategoryDashboard();
    }

	@Post()
	@UseGuards(TokenGuard, JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@ApiTags('YouTubeCategory')
	@ApiCreatedResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiBody({ type: YouTubeCategoryDTO })
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	saveYouTubeCategory(@Body() data: YouTubeCategoryDTO) {
		return this.youtubecategoryService.saveYouTubeCategory(data);
	}

	@Get(':id')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('YouTubeCategory')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	getYouTubeCategory(@Param('id') id: string) {
		return this.youtubecategoryService.getYouTubeCategory(id);
	}

	@Patch(':id')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('YouTubeCategory')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: YouTubeCategoryDTO })
	updateYouTubeCategory(@Param('id') id: string, @Body() data: Partial<YouTubeCategoryDTO>) {
		return this.youtubecategoryService.updateYouTubeCategory(id, data);
	}

	@Delete(':id')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('YouTubeCategory')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	deleteYouTubeCategory(@Param('id') id: string) {
		return this.youtubecategoryService.deleteYouTubeCategory(id);
	}
}
