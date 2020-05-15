import { ApiProperty } from '@nestjs/swagger';

export class BookDTO{
    
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
    readlink: string;

    @ApiProperty()
    readtext: string;

    @ApiProperty()
    author: string;

    @ApiProperty()
    publisher: string;

    @ApiProperty()
    rating: string;

}