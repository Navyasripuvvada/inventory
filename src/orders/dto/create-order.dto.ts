import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({
    example: 'john@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({
    example: '+91 9876543210',
  })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({
    example: 'Hyderabad, Telangana',
  })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}