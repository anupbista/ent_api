import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CategoryDTO{
    
    @ApiProperty({ type: String, description: 'Name' })
    @IsString()
    name: string; 

}