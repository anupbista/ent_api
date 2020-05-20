import { ApiProperty } from '@nestjs/swagger';
import { GenreEntity } from '../genre/genre.entity';
import { IsNotEmpty, IsString, IsOptional, ValidateNested } from 'class-validator';

export class MovieDTO{
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string; 

    @ApiProperty()
    @IsString()
    @IsOptional()
    imagepath: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    releasedate: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    downloadlink: string;
    
    @ApiProperty()
    @IsNotEmpty()
    downloadtext: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    watchlink: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    watchtext: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    rating: string;

    @ApiProperty()
    @IsNotEmpty()
    country: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @ValidateNested()
    genre: GenreEntity[];

}