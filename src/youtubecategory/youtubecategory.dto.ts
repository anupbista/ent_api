import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class YouTubeCategoryDTO{
    
    @ApiProperty({ type: String, description: 'Name' })
    @IsString()
    name: string; 

}