import { ApiProperty } from '@nestjs/swagger';
import { GenreEntity } from '../genre/genre.entity';

export class MovieDTO{
    
    @ApiProperty()
    name: string; 

    @ApiProperty()
    imagepath: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    releasedate: string;
    
    @ApiProperty()
    downloadlink: string;
    
    @ApiProperty()
    downloadtext: string;
    
    @ApiProperty()
    watchlink: string;

    @ApiProperty()
    watchtext: string;

    @ApiProperty()
    rating: string;

    @ApiProperty()
    country: string;
    
    @ApiProperty()
    genre: GenreEntity[];

}