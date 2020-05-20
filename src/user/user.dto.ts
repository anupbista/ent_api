import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UserDTO{

    @ApiProperty()
    @IsString()
    firstname: string;

    @ApiProperty()
    @IsOptional()
     @IsString()
    middlename: string;

    @ApiProperty()
     @IsString()
    lastname: string;

    @ApiProperty()
     @IsString()
    role: string;

    @ApiProperty()
    @IsOptional()
    imagepath: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    password: string;

}