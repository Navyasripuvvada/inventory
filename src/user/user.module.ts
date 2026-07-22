import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { UploadsModule } from '../uploads/upload.module';

import {
  UserInv,
  UserSchema,
} from '../user/schema/user.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserInv.name,
        schema: UserSchema,
      },
    ]),
    UploadsModule,
  ],

  controllers: [
    UsersController,
  ],

  providers: [
    UserService,
  ],

  exports: [
    UserService,
  ],
})
export class UserModule {}