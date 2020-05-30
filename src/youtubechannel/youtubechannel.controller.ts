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
import { YouTubeChannelService } from './youtubechannel.service';
import { YouTubeChannelDTO } from './youtubechannel.dto';
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

@Controller('youtubechannels')
export class YouTubeChannelController {
	constructor(private youtubechannelService: YouTubeChannelService) {}

	@Get()
	@ApiTags('YouTubeChannels')
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
	getAllYouTubeChannels(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
		return this.youtubechannelService.getAllYouTubeChannels(page, limit, search);
	}

	@Get('/dashboard')
    @UseGuards(TokenGuard, JwtAuthGuard)
    @ApiTags('YouTubeChannels')
    @ApiOkResponse({ description: 'Success' })
    @ApiBearerAuth('Authorization')
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    getYouTubeChannelDashboard(){
        return this.youtubechannelService.getYouTubeChannelDashboard();
    }

	@Post(':id/image')
	@ApiTags('YouTubeChannels')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@UseGuards(TokenGuard, JwtAuthGuard)
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: './uploads/youtubechannels',
				filename: editFileName
			}),
			fileFilter: imageFileFilter
		})
	)
	createYouTubeChannelImage(@Param('id') id: string, @UploadedFile() file) {
		return this.youtubechannelService.updateYouTubeChannel(id, { imagepath: file.path });
	}

	@Post()
	@UseGuards(TokenGuard, JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@ApiTags('YouTubeChannels')
	@ApiCreatedResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: YouTubeChannelDTO })
	createYouTubeChannel(@Body() data: YouTubeChannelDTO) {
		return this.youtubechannelService.saveYouTubeChannel(data);
	}

	@Get(':id')
	@ApiTags('YouTubeChannels')
	@ApiOkResponse({ description: 'Success' })
	getYouTubeChannel(@Param('id') id: string) {
		return this.youtubechannelService.getYouTubeChannel(id);
	}

	@Patch(':id')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('YouTubeChannels')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: YouTubeChannelDTO })
	patchYouTubeChannel(@Param('id') id: string, @Body() data: Partial<YouTubeChannelDTO>) {
		return this.youtubechannelService.updateYouTubeChannel(id, data);
	}

	@Delete(':id')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('YouTubeChannels')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: YouTubeChannelDTO })
	deleteYouTubeChannel(@Param('id') id: string) {
		return this.youtubechannelService.deleteYouTubeChannel(id);
	}
}
