import {Injectable,NotFoundException,} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserInv, UserDocument,} from '../user/schema/user.schema';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService{
    constructor(
        @InjectModel(UserInv.name)
        private readonly userModel:Model<UserDocument>
    ){}
    async getme(userId:string){
        const user = await this.userModel.findById(userId).select('-password')
        if(!user){
            throw new NotFoundException
        }
    }
}
