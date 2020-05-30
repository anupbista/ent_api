import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryEntity } from '../category/category.entity';
import { IsNotEmpty, IsString, IsOptional, ValidateNested, IsDecimal, IsNumber } from 'class-validator';

export class YouTubeVideoDTO{
    
    @ApiProperty({ type: String, description: 'Name' })
    @IsNotEmpty()
    @IsString()
    name: string; 
    
    @ApiProperty({ type: String, description: 'Watch link' })
    @IsNotEmpty()
    @IsString()
    watchlink: string;
    
    @ApiProperty({ type: String, description: 'Watch text' })
    @IsNotEmpty()
    watchtext: string;

    @ApiProperty({ type: String, description: 'Uploaded by', required: false })
    @ApiPropertyOptional()
    @IsOptional()
    uploadedby: string;

    @ApiProperty({ type: String, description: 'Uploaded Channel', required: false })
    @ApiPropertyOptional()
    @IsOptional()
    uploadedchannel: string;
    
    @ApiProperty({ type: String, description: 'Category' })
    @IsNotEmpty()
    @ValidateNested()
    category: CategoryEntity[];

}