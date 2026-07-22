import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductQueryDto {
  @ApiPropertyOptional({
    example: '1',
    description: 'Page number',
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    example: '10',
    description: 'Number of records per page',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    example: 'laptop',
    description: 'Search by product name or SKU',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'Electronics',
    description: 'Filter by category',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'true',
    description: 'Filter active/inactive products',
  })
  @IsOptional()
  @IsBooleanString()
  isActive?: string;

  @ApiPropertyOptional({
    example: 'name',
    description: 'Sort field',
  })
  @IsOptional()
  @IsIn([
    'name',
    'sku',
    'sellingPrice',
    'costPrice',
    'createdAt',
  ])
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'asc',
    description: 'Sort order',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;
}