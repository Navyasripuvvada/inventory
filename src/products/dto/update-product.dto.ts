import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateProductDto {

  @ApiPropertyOptional({
    example: 'Dell Laptop Updated',
  })
  @IsOptional()
  @IsString()
  name?: string;


  @ApiPropertyOptional({
    example: 'Updated laptop description',
  })
  @IsOptional()
  @IsString()
  description?: string;


  @ApiPropertyOptional({
    example: 60000,
  })
  @IsOptional()
  @IsNumber()
  sellingPrice?: number;


  @ApiPropertyOptional({
    example: 50000,
  })
  @IsOptional()
  @IsNumber()
  costPrice?: number;


  @ApiPropertyOptional({
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;


  @ApiPropertyOptional({
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  reorderLevel?: number;


  @ApiPropertyOptional({
    example: 'pcs',
  })
  @IsOptional()
  @IsString()
  unit?: string;


  @ApiPropertyOptional({
    example: 'Electronics',
  })
  @IsOptional()
  @IsString()
  category?: string;


  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

}