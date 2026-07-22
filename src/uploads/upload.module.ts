import { Module } from '@nestjs/common';
import { UploadsController } from '../uploads/upload.controller';
import { UploadsService } from '../uploads/upload.service';
import { cloudinaryConfig } from '../config/cloudinary.config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInv,UserSchema } from '../user/schema/user.schema';

@Module({
    imports:[
         MongooseModule.forFeature([
      {
        name: UserInv.name,
        schema: UserSchema,
      },
    ]),

    ],
  controllers: [
    UploadsController,
  ],
  providers: [
    UploadsService,
    cloudinaryConfig,
    
  ],
  exports: [
    UploadsService,
  ],
})
export class UploadsModule {}