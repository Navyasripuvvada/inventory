import {
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';

import {ApiPropertyOptional,} from '@nestjs/swagger';
import { UserRole } from '../schema/user.schema';


export class UpdateUserDto {
 @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.MANAGER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;



  @ApiPropertyOptional({
    example: true,
    description: 'User active status',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  

}