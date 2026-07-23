import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateInventoryDto {

  @ApiProperty({
    example: '687abc123456789',
    description: 'Product ID from Products Module',
  })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;


  @ApiProperty({
    example: 100,
    description: 'Initial quantity of product',
  })
  @IsNumber()
  @Min(0)
  quantity: number;


  @ApiProperty({
    example: 10,
    description: 'Minimum stock level before low stock alert',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reorderLevel?: number;


  @ApiProperty({
    example: 'Main Warehouse',
    description: 'Warehouse location',
    required: false,
  })
  @IsString()
  @IsOptional()
  warehouse?: string;

}