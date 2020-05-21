import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UserDTO {
	@ApiProperty({ type: String, description: 'Firstname' })
	@IsString()
	firstname: string;

	@ApiProperty({ type: String, description: 'Middlename', required: false })
	@IsOptional()
	@IsString()
	middlename: string;

	@ApiProperty({ type: String, description: 'Lastname' })
	@IsString()
	lastname: string;

	@ApiProperty({ type: String, description: 'Role' })
	@IsString()
	role: string;

	@ApiProperty({ type: String, description: 'Image path', required: false })
	@IsOptional()
	imagepath: string;

	@ApiProperty({ type: String, description: 'Email' })
	@IsEmail()
	email: string;

	@ApiProperty({ type: String, description: 'Username' })
	@IsString()
	username: string;

	@ApiProperty({ type: String, description: 'Password (if empty default password is used)', required: false })
	@IsString()
	@IsOptional()
	password: string;
}
