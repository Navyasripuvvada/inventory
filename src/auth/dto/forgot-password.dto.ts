import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'john@example.com ',
    description: 'Registered email address ',
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}
