import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';


class PurchaseOrderItemDto {

  @ApiProperty({
    description: 'Product ID',
    example: '66b123456789'
  })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;



  @ApiProperty({
    description: 'Quantity of product',
    example: 10
  })
  @IsNumber()
  @IsPositive()
  quantity: number;



  @ApiProperty({
    description: 'Supplier cost price per unit',
    example: 500
  })
  @IsNumber()
  @IsPositive()
  costPrice: number;

}



export class CreatePurchaseOrderDto {


  @ApiProperty({
    description: 'Supplier ID',
    example: '66a123456789'
  })
  @IsMongoId()
  @IsNotEmpty()
  supplierId: string;



  @ApiProperty({
    description: 'Products included in purchase order',
    type: [PurchaseOrderItemDto],
    example:[
      {
        productId:'66b123456789',
        quantity:10,
        costPrice:500
      }
    ]
  })
  @IsArray()
  @ValidateNested({each:true})
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];

}