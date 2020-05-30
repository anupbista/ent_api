import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryEntity } from '../category/category.entity';
import { IsNotEmpty, IsString, IsOptional, ValidateNested, IsDecimal, IsNumber } from 'class-validator';

export class GameDTO{
    
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

    @ApiProperty({ type: Number, description: 'Rating' })
    @IsNotEmpty()
    @IsNumber()
    rating: number;
    
    @ApiProperty({ type: String, description: 'Category' })
    @IsNotEmpty()
    @ValidateNested()
    category: CategoryEntity[];

}