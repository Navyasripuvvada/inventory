import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SupplierQueryDto {
  @ApiPropertyOptional({
    example: '1',
  })
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({
    example: '10',
  })
  @IsOptional()
  limit?: string;

  @ApiPropertyOptional({
    example: 'apple',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;


  @ApiPropertyOptional({
    example: 'true',
  })
  @IsOptional()
  isActive?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
  })
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'desc',
  })
  @IsOptional()
  sortOrder?: string;
}