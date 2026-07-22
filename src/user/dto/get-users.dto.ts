import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

import { UserRole, UserStatus } from '../schema/user.schema';


export class GetUsersDto {

  @ApiPropertyOptional({
    example: 'navya',
    description: 'Search by full name or email',
  })
  @IsOptional()
  @IsString()
  search?: string;



  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.CUSTOMER,
    description: 'Filter users by role',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;



  @ApiPropertyOptional({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    description: 'Filter users by status',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;



  @ApiPropertyOptional({
    example: 1,
    description: 'Page number',
  })
  @IsOptional()
  @IsNumberString()
  page?: number;



  @ApiPropertyOptional({
    example: 10,
    description: 'Number of records per page',
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;

}