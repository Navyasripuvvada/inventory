import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductInv } from '../../products/schema/products.schema';
import { UserInv } from '../../user/schema/user.schema';

export type InventoryDocument = InventoryInv & Document;

@Schema({
  timestamps: true,
})
export class InventoryInv {

  @Prop({
    type: Types.ObjectId,
    ref: ProductInv.name,
    required: true,
  })
  productId: Types.ObjectId;


  // Total quantity available in inventory
  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  quantity: number;


  // Stock available for new orders
  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  availableStock: number;


  // Stock temporarily reserved during order/payment process
  @Prop({
    type: Number,
    default: 0,
  })
  reservedStock: number;


  // Minimum stock level before alert
  @Prop({
    type: Number,
    default: 10,
  })
  reorderLevel: number;


  // Warehouse location (optional)
  @Prop({
    type: String,
    default: 'Main Warehouse',
  })
  warehouse: string;


  // Who created this inventory record
  @Prop({
    type: Types.ObjectId,
    ref: UserInv.name,
    required: true,
  })
  createdBy: Types.ObjectId;


  // Soft delete
  @Prop({
    default: false,
  })
  isDeleted: boolean;


  @Prop()
  deletedAt?: Date;
}


export const InventorySchema =
  SchemaFactory.createForClass(InventoryInv);