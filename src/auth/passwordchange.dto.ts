import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PasswordChangeDTO{
    
    @ApiProperty({type: String, description: 'Old Password'})
    @IsString()
    oldpassword: string; 

    @ApiProperty({type: String, description: 'New Password'})
    @IsString()
    newpassword: string;

}