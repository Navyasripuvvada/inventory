import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument= ProductInv & Document;

@Schema({
  timestamps: true,
})
export class ProductInv {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  })
  sku: string;

  @Prop({
    trim: true,
  })
  description: string;

  @Prop({
    required: true,
    min: 0,
  })
  sellingPrice: number;

  @Prop({
    required: true,
    min: 0,
  })
  costPrice: number;

  @Prop({
    required: true,
    min: 0,
    default: 0,
  })
  quantity: number;

  @Prop({
    required: true,
    min: 0,
    default: 10,
  })
  reorderLevel: number;

  @Prop({
    required: true,
    trim: true,
  })
  unit: string; // pcs, kg, litre, box

  @Prop({
    trim: true,
  })
  category: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
  default: false,
    })
    isDeleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(ProductInv);