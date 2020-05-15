import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDTO{

    @ApiProperty()
    userid: string;

    @ApiProperty()
    token: string;

}