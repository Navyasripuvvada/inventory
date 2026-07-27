import {
 IsEnum,
 IsNotEmpty
} from 'class-validator';

import {
 ApiProperty
} from '@nestjs/swagger';



export enum PurchaseOrderStatus {

 PENDING = 'PENDING',

 APPROVED = 'APPROVED',

 SHIPPED = 'SHIPPED',

 RECEIVED = 'RECEIVED',

 CANCELLED = 'CANCELLED'

}



export class UpdatePoStatusDto {


 @ApiProperty({
  enum:PurchaseOrderStatus,
  example:'SHIPPED'
 })
 @IsEnum(PurchaseOrderStatus)
 @IsNotEmpty()
 status:PurchaseOrderStatus;

}