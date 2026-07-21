import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  MANAGER='MANAGER',
  SUPPLIER='SUPPLIER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  fullName: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

 

  @Prop({
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Prop({
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

   @Prop({
    required: true, unique: true, index: true 
  })
 mobileNumber: string;

  @Prop({
    unique: true,
    sparse: true,
    default: null,
  })
  customerId: string;

  @Prop({
    default: null,
  })
  profileImage: string;

  @Prop({
    default: false,
  })
  isEmailVerified: boolean;

  @Prop({
    default: null,
  })
  lastLoginAt: Date;

  @Prop({
    default: false,
  })
  isDeleted: boolean;


  @Prop({
  type: String,
  default: null,
})
emailOtp: string | null;

@Prop({
  type: Date,
  default: null,
})
otpExpiry: Date | null;

@Prop({type:String,
  default:null
 })
 resetPasswordToken:string | null;


 @Prop({
  type:Date,
  default:null
 })
 resetPasswordExpires:Date|null;


}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });