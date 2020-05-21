import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenreEntity } from '../genre/genre.entity';
import { IsNotEmpty, IsString, IsOptional, ValidateNested, IsDecimal, IsNumber } from 'class-validator';

export class MovieDTO{
    
    @ApiProperty({ type: String, description: 'Name' })
    @IsNotEmpty()
    @IsString()
    name: string; 

    @ApiProperty({ type: String, description: 'Image path', required: false })
    @IsString()
    @IsOptional()
    imagepath: string;

    @ApiProperty({ type: String, description: 'Description' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ type: String, description: 'Release date' })
    @IsNotEmpty()
    @IsString()
    releasedate: string;
    
    @ApiProperty({ type: String, description: 'Download link' })
    @IsNotEmpty()
    @IsString()
    downloadlink: string;
    
    @ApiProperty({ type: String, description: 'Download text' })
    @IsNotEmpty()
    downloadtext: string;
    
    @ApiProperty({ type: String, description: 'Watch link' })
    @IsNotEmpty()
    @IsString()
    watchlink: string;

    @ApiProperty({ type: String, description: 'Watch link' })
    @IsNotEmpty()
    @IsString()
    watchtext: string;

    @ApiProperty({ type: Number, description: 'Rating' })
    @IsNotEmpty()
    @IsNumber()
    rating: number;

    @ApiProperty({ type: String, description: 'Country' })
    @IsNotEmpty()
    country: string;
    
    @ApiProperty({ type: String, description: 'Genre' })
    @IsNotEmpty()
    @ValidateNested()
    genre: GenreEntity[];

}