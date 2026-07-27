import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.services';
import { JwtStrategy } from './strategy/jwt.strategy';
import { SessionInv,SessionSchema } from '../user/schema/session.schema';
import { SupplierInv,SupplierSchema} from '../supplier/schema/supplier.schema';
import { UserInv,UserSchema } from '../user/schema/user.schema';
import { JwtAuthGuard} from './guard/authguard.guard';


import { MailModule } from '../email/email.module';


@Module({
  imports: [
    ConfigModule,
    MailModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_SECRET_KEY'),
      }),
    }),

    MongooseModule.forFeature([
       {
      name: UserInv.name,
      schema: UserSchema,
     },

      {
        name: SessionInv.name,
        schema: SessionSchema,
      },
      {
        name: SupplierInv.name,
        schema: SupplierSchema,
      },
    ]),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard
  ],

  exports: [
    AuthService,
    PassportModule,
    JwtStrategy,
    JwtModule,
    JwtAuthGuard,
  ],
})
export class AuthModule {}