import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class BookDTO {
	@ApiProperty({ type: String, description: 'Name' })
	@IsString()
	name: string;

	@ApiProperty({ type: String, description: 'Image path', required: false })
	@IsString()
	@IsOptional()
	imagepath: string;

	@ApiProperty({ type: String, description: 'Description' })
	@IsString()
	description: string;

	@ApiProperty({ type: String, description: 'Release date' })
	@IsString()
	releasedate: string;

	@ApiProperty({ type: String, description: 'Download link', required: false })
	@IsString()
	@IsOptional()
	downloadlink: string;

	@ApiProperty({ type: String, description: 'Download text', required: false })
	@IsString()
	@IsOptional()
	downloadtext: string;

	@ApiProperty({ type: String, description: 'Read link', required: false })
	@IsString()
	@IsOptional()
	readlink: string;

	@ApiProperty({ type: String, description: 'Read text', required: false })
	@IsString()
	@IsOptional()
	readtext: string;

	@ApiProperty({ type: String, description: 'Author' })
	@IsString()
	author: string;

	@ApiProperty({ type: String, description: 'Publisher', required: false })
	@IsString()
	@IsOptional()
	publisher: string;

	@ApiProperty({ type: Number, description: 'Rating', required: false })
	@IsNumber()
	@IsOptional()
	rating: number;
}
