import { ApiProperty ,ApiPropertyOptional} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,IsEnum,IsOptional
} from 'class-validator';
import { UserRole } from '../../user/schema/user.schema';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{6,14}$/, {
    message:
      'Mobile number must include country code. Example: +919876543210',
  })
  mobileNumber: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)',
  })
  password: string;

   @ApiProperty({
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  @IsEnum(UserRole)
  role: UserRole;


  @ApiPropertyOptional({
    example:'Ravi Electronics',
    description:
    'Required only when role is SUPPLIER'
  })
  @IsOptional()
  companyName?:string;


 
}
