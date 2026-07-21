import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';


export class VerifyEmailDto {

@ApiProperty({ example: 'john@example.com' })
@IsEmail()
email:string;

@ApiProperty({ example: '789056' })
@IsString()
otp:string;


}