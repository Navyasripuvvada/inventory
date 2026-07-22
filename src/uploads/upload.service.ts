import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UserInv,UserDocument } from '../user/schema/user.schema';
import { ProductInv, ProductDocument } from '../products/schema/products.schema';

import { Model } from 'mongoose';

@Injectable()
export class UploadsService {
    constructor(
    @InjectModel(UserInv.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(ProductInv.name)
    private readonly productModel:Model<ProductDocument>,
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
  async uploadProductImage(productId:string, file: Express.Multer.File,){
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'Inventory/uploads',
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
          } else {
            resolve(uploadResult);
          }
        },
      )
        .end(file.buffer);
    });
    const product = await this.productModel.findById(productId);
    if(!product){
      throw new NotFoundException( 'Product not found',)
    }
     product.images.push( result.secure_url,);
     await product.save();
     return {
      message:
        'Product image uploaded successfully',
        images:result.secure_url,
        product,
    };


  }

}