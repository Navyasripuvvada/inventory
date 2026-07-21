import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { User } from './user.schema';

export type SessionDocument = Session & Document;

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  LOGGED_OUT = 'LOGGED_OUT',
  REVOKED = 'REVOKED',
}

@Schema({
  timestamps: true,
})
export class Session {
  @Prop({
    required: true,
    unique: true,
  })
  sessionId: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({
    enum: SessionStatus,
    default: SessionStatus.ACTIVE,
  })
  status: SessionStatus;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    required: true,
  })
  expiresAt: Date;

  @Prop({
    default: Date.now,
  })
  lastActivityAt: Date;

  @Prop({
    type: String,
    default: null,
  })
  deviceInfo: string | null;

  @Prop({
    type: String,
    default: null,
  })
  ipAddress: string | null;

  @Prop({
    type: String,
    default: null,
  })
  userAgent: string | null;

  @Prop({
    type:String,
    default: null,
    select: false,
  })
  refreshToken: string | null;

  @Prop({
    type:Date,
    default: null,
  })
  refreshTokenExpiresAt: Date | null;

  @Prop({
    type:Date,
    default: null,
  })
  loggedOutAt: Date | null;

  @Prop({
    type:String,
    default: null,
  })
  logoutReason: string | null;

  @Prop({
    default: false,
  })
  forceLoggedOut: boolean;
}

export const SessionSchema =
  SchemaFactory.createForClass(Session);

SessionSchema.index({ userId: 1 });
SessionSchema.index({ status: 1 });
SessionSchema.index({ expiresAt: 1 });