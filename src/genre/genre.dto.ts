import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GenreDTO{
    
    @ApiProperty()
    @IsString()
    name: string; 

}