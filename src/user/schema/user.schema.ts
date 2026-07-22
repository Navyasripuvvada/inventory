import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserInv & Document;

export enum UserRole {
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
export class UserInv {
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
    type: String,
    unique: true,
    sparse: true,
    index: true,
  })
  customerId?: string | null;

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

 @Prop({type:String,
  default:null
 })
 address:string | null;

 @Prop({type:Date,
  default:null
 })
 dateOfBirth:Date | null


 @Prop({
  type:Date,
  default:null
 })
 resetPasswordExpires:Date|null;


}

export const UserSchema = SchemaFactory.createForClass(UserInv);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });