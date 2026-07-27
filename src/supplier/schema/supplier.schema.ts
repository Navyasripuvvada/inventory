import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export type SupplierDocument = SupplierInv & Document;


export enum SupplierStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}


@Schema({
  timestamps: true,
})
export class SupplierInv {


  @Prop({
    type: Types.ObjectId,
    ref: 'UserInv',
    required: true,
    unique: true,
  })
  userId: Types.ObjectId;



  @Prop({
    required: true,
    trim: true,
  })
  companyName: string;



  @Prop({
    required: false,
    trim: true,
  })
  companyAddress?: string;



  @Prop({
    required: false,
    trim: true,
  })
  gstNumber?: string;



  @Prop({
    type: String,
    enum: SupplierStatus,
    default: SupplierStatus.PENDING,
  })
  status: SupplierStatus;



  @Prop({
    type: [Types.ObjectId],
    ref: 'Product',
    default: [],
  })
  products: Types.ObjectId[];



  @Prop({
    default: true,
  })
  isActive: boolean;



  @Prop({
    default: false,
  })
  isDeleted: boolean;



  @Prop({
    default: null,
  })
  deletedAt?: Date;



  @Prop({
    type: Types.ObjectId,
    ref: 'UserInv',
  })
  approvedBy?: Types.ObjectId;



  @Prop({
    default: null,
  })
  approvedAt?: Date;

}



export const SupplierSchema =
SchemaFactory.createForClass(SupplierInv);