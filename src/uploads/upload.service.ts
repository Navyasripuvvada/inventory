import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UserInv,UserDocument } from '../user/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UploadsService {
    constructor(
 @InjectModel(UserInv.name)
 private readonly userModel: Model<UserDocument>,
){}


  async uploadFile(userId:string,
    file: Express.Multer.File,
  ) {

     const result:any = await new Promise((resolve, reject)=>{

      cloudinary.uploader.upload_stream(
        {
          folder:'chat',
        },
        (error,result)=>{

          if(error){
            reject(error);
          }

          else{
            resolve(result);
          }

        }
      )
      .end(file.buffer);

    });

     const user =
        await this.userModel.findByIdAndUpdate(
        userId,
        {
            profileImage:result.secure_url
        },
        {
            new:true
        }
        );


        return {
        message:"profile image updated",
        user
        };

        }

}