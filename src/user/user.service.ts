import {BadRequestException, Injectable,NotFoundException,} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserInv, UserDocument,} from '../user/schema/user.schema';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UploadsService } from '../uploads/upload.service';

@Injectable()
export class UserService{
    constructor(
        @InjectModel(UserInv.name)
        private readonly userModel:Model<UserDocument>,
    ){}

    //get current login user
    async getme(userId:string){
        try{
            const user = await this.userModel.findById(userId).select('-password')
            console.log('USER FOUND:', user);

            if(!user){
                throw new NotFoundException("User not found")
            }
            return {
                message:"user details fetched successfully",user
            }
        }catch(error:any){
            throw new BadRequestException(error.message)
            
        }
    }
    //update own user profile
    async updateProfile(userId:string,dto:UpdateProfileDto){
        try{
            const user = await this.userModel.findByIdAndUpdate(userId,dto,{new:true,}).select('-password');
            if(!user){
                throw new NotFoundException("user not found")
            }
            return {
                message:"user updated successfully",user
            }

        }catch(error:any){
            throw new BadRequestException(error.message)
        }
        
    }
     // Manager/Admin get all users
    async findAll(dto:GetUsersDto) {
        try{
            const {search,role,status,page=1,limit=10,}=dto
            const query:any = {
                isDeleted:false,
            }
            if(search){
                query.$or=[
                    {
                        fullName:{
                            $regex:search,$options:'i'
                        },
                    },
                    {
                        email:{
                            $regex:search,$options:'i'
                        },
                    }
                ]
            }
            if(role){
            query.role=role;
            }


            if(status){
            query.status=status;
            }
            const users= await this.userModel.find(query)
            .select('-password')
            .skip((Number(page)-1)*Number(limit))
            .limit(Number(limit));

            const total =await this.userModel.countDocuments(query);
            return{
               users,
               pagination:{
                    total,
                    page:Number(page),
                    limit:Number(limit),
                    totalPages:Math.ceil(total/Number(limit))
                }
    
               
            }
        }catch(error:any){
            throw new BadRequestException(error.message)
        }

    }
     // Admin/Manager get user by id
     async getById(userId:string){
        try{
            const user = await this.userModel.findById(userId).select('-password')
            if(!user){
                throw new NotFoundException("User Not Found")
            }
            return{
                message:'User fetched Successfully',user
            }

        }catch(error:any){
            throw new BadRequestException(error.message)
        }
       
     }
      // Admin/Manager updates the user profile 

     async updateProfileByManager(userId:string,dto:UpdateUserDto){
        try{
            const user = await this.userModel.findByIdAndUpdate(userId,dto).select('-password')
            if(!user){
                throw new NotFoundException("User Not Found")
            }
            return {
                message:'User data Updated Successfully',user
            }

        }catch(error:any){
            throw new BadRequestException(error.message)
        }
        

     }
       // Soft delete user account
    async deleteAccount(userId:string,){
        try{
            const user = await this.userModel .findByIdAndUpdate(userId,
            {
                isDeleted:true,
                status:'INACTIVE',
            },
            {
                new:true,
            } );
            if(!user){
                 throw new NotFoundException('User not found');
             }
             return {
                message:'Account deleted successfully',
            };

        }catch(error:any){
            throw new BadRequestException(error.message)
        }

    }

   
}
