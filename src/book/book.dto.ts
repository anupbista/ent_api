import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class BookDTO{
    
    @ApiProperty()
    @IsString()
    name: string; 

    @ApiProperty()
    @IsString()
    @IsOptional()
    imagepath: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    releasedate: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    downloadlink: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    downloadtext: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    readlink: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readtext: string;

    @ApiProperty()
    @IsString()
    author: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    publisher: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    rating: string;

}