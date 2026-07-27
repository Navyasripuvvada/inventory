import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type PurchaseOrderDocument = PurchaseOrderInv & Document;


@Schema({ timestamps: true })
export class PurchaseOrderInv {


  @Prop({
    type: Types.ObjectId,
    ref: 'SupplierInv',
    required: true
  })
  supplier: Types.ObjectId;


  @Prop([
    {
      product: {
        type: Types.ObjectId,
        ref: 'ProductInv',
        required: true
      },

      quantity: {
        type: Number,
        required: true
      },

      costPrice: {
        type: Number,
        required: true
      }
    }
  ])
  items: {
    product: Types.ObjectId;
    quantity: number;
    costPrice: number;
  }[];



  @Prop({
    required: true
  })
  totalAmount: number;



  @Prop({
    enum:[
      'PENDING',
      'APPROVED',
      'SHIPPED',
      'RECEIVED',
      'CANCELLED'
    ],
    default:'PENDING'
  })
  status:string;



  @Prop({
    type: Types.ObjectId,
    ref:'UserInv',
    required:true
  })
  createdBy: Types.ObjectId;

}


export const PurchaseOrderSchema =
SchemaFactory.createForClass(PurchaseOrderInv);