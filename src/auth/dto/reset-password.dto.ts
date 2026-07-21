import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset token received from forgot-password response' })
  @IsString()
  @IsNotEmpty()
  resetPasswordToken: string;

  @ApiProperty({ example: 'NewPassword@123' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  newPassword: string;

  @ApiProperty({ example: 'NewPassword@123' })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
