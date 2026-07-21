import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';


import { User,UserDocument } from '../../user/schema/user.schema';
import { Session,SessionDocument } from '../../user/schema/session.schema';
export interface JwtPayload {
  sub: string;
  sessionId: string;
}



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
     @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {
    const secret =configService.get<string>(  'ACCESS_SECRET_KEY',);
    if (!secret) {
      throw new Error(
        'ACCESS_SECRET_KEY is missing in environment variables',
      );
    }
    super({
      jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration:false,
      secretOrKey: secret,
    });
  }
  async validate(payload: JwtPayload) {
    console.log("JWT PAYLOAD:", payload,);
    const user =await this.userModel.findById(payload.sub).select('-password');
    if(!user){
      throw new UnauthorizedException('User account not found',);
    }
     const session =await this.sessionModel.findOne({sessionId: payload.sessionId,});
     if(!session){
      throw new UnauthorizedException( 'Session not found. Please login again',);
    }
    if(!session.isActive){
      throw new UnauthorizedException( 'Session is inactive. Please login again',);
    }
    if(session.expiresAt &&session.expiresAt < new Date()){
      throw new UnauthorizedException('Session expired. Please login again',);

    }
    session.lastActivityAt = new Date();
    await session.save();
    return {
      userId:user._id.toString(),
      email:user.email,
      name:user.fullName,
      role:user.role,
      sessionId:session.sessionId,
    };
  }
}