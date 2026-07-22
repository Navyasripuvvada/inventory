import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Dell Laptop',
    description: 'Product name',
  })
  @IsString()
  name: string;

 
  @ApiPropertyOptional({
    example: 'Dell Inspiron 15 i5 16GB RAM',
    description: 'Product description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 45000,
    description: 'Product cost price',
  })
  @IsNumber()
  @Min(0)
  costPrice: number;

  

  @ApiProperty({
    example: 55000,
    description: 'Product selling price',
  })
  @IsNumber()
  @Min(0)
  sellingPrice: number;

  @ApiPropertyOptional({
    example: 'Electronics',
    description: 'Product category',
  })
  @IsString()
  category: string;

  @ApiProperty({
    example: 'pcs, kg, litre, box',
    description: 'Product measurement unit',
  })
  @IsString()
  @IsNotEmpty()
  unit: string;


  
 
}