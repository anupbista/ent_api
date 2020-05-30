import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class YouTubeChannelDTO {
	@ApiProperty({ type: String, description: 'Name' })
	@IsString()
	name: string;

	@ApiProperty({ type: String, description: 'Image path', required: false })
	@IsString()
	@IsOptional()
	imagepath: string;

	@ApiProperty({ type: String, description: 'Channel link' })
	@IsString()
	channellink: string;
}
