import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    example: 'john@example.com ',
    description: 'email for resending password ',
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}
