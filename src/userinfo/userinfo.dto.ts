import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserInfoDTO{

    @ApiProperty()
    @IsString()
    userid: string;

    @ApiProperty()
    @IsString()
    token: string;

}