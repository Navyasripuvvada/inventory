import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    example: '68862c5f4e0e3c92a2c4f123',
    description: 'Product ID',
  })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity to order',
  })
  @IsNumber()
  @IsPositive()
  quantity: number;
}