import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ProductInv } from '../../products/schema/products.schema';

@Schema({
  _id:false
})
export class OrderItemInv {

  @Prop({
    type: Types.ObjectId,
    ref: ProductInv.name,
    required:true,
  })
  productId: Types.ObjectId;


  @Prop({
    required:true,
    trim:true,
  })
  productName:string;


  @Prop({
    required:true,
    min:1,
  })
  quantity:number;


  @Prop({
    required:true,
    min:0,
  })
  unitPrice:number;


  @Prop({
    required:true,
    min:0,
  })
  subtotal:number;
}


export const OrderItemSchema =
SchemaFactory.createForClass(OrderItemInv);