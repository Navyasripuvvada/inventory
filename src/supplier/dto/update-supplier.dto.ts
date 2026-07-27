import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSupplierDto {
  @ApiPropertyOptional({
    example: 'Apple Distributor India',
  })
  @IsOptional()
  @IsString()
  supplierName?: string;

  @ApiPropertyOptional({
    example: 'Raj Kumar',
  })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({
    example: 'raj@appledist.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '9876543210',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'Hyderabad, Telangana',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: [
      '687abc123456789012345678',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  products?: string[];
}