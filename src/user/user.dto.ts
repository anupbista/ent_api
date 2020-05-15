import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserDTO{

    @ApiProperty()
    firstname: string;

    @ApiProperty()
    middlename: string;

    @ApiProperty()
    lastname: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    imagepath: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

}