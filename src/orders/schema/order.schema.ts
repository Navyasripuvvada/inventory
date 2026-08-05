import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { OrderStatus } from '../enum/order.enum';
import { OrderItemInv, OrderItemSchema } from './order-item.schema';
import { UserInv } from '../../user/schema/user.schema';


export type OrderDocument = HydratedDocument<OrderInv>;


@Schema({
  timestamps:true,
  versionKey:false,
})
export class OrderInv {


  @Prop({
    required:true,
    unique:true,
  })
  orderNumber:string;



  @Prop({
    required:true,
    trim:true,
  })
  customerName:string;



  @Prop({
    required:true,
    lowercase:true,
    trim:true,
  })
  customerEmail:string;



  @Prop({
    required:true,
    trim:true,
  })
  customerPhone:string;



  @Prop({
    required:true,
    trim:true,
  })
  shippingAddress:string;



  @Prop({
    type:[OrderItemSchema],
    required:true,
  })
  orderItems:OrderItemInv[];



  @Prop({
    required:true,
    min:0,
  })
  totalAmount:number;



  @Prop({
    enum:OrderStatus,
    default:OrderStatus.PENDING,
  })
  status:OrderStatus;



  @Prop({
    type:Types.ObjectId,
    ref:UserInv.name,
    required:true,
  })
  createdBy:Types.ObjectId;



  @Prop({
    default:false,
  })
  isCancelled:boolean;



  @Prop()
  cancelledAt?:Date;



  @Prop()
  cancellationReason?:string;

}


export const OrderSchema =
SchemaFactory.createForClass(OrderInv);