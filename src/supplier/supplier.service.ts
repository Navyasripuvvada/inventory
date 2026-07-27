import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Model } from 'mongoose';

import {
  SupplierInv,
  SupplierDocument,
  SupplierStatus,
} from './schema/supplier.schema';

import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierQueryDto } from './dto/supplier-query.dto';
import { UpdateSupplierStatusDto } from './dto/update-status.dto';
import { MailService } from '../email/email.service';

@Injectable()
export class SupplierService{
    constructor(
        @InjectModel(SupplierInv.name)
        private readonly supplierModel:Model<SupplierDocument>,
        private readonly mailService: MailService,
    ){}
    async getAllSuppliers(dto:SupplierQueryDto){
        try{
            const {
                page='1',
                limit='10',
                search,
                status,
                sortBy='createdAt',
                sortOrder='desc'}=dto;
            const filter:any={ isDeleted:false};
            if(search){
                filter.$or=[
                    {
                        companyName:{
                            $regex:search,
                            $options:'i'
                        }
                    }
                ];
            }
            if(status){
                filter.status=status;
            }
            const currentPage=Number(page);
            const pageLimit=Number(limit);
            const skip =(currentPage-1)*pageLimit;
            const [suppliers,total]=await Promise.all([
                this.supplierModel.find(filter)
                    .populate( 'userId', 'fullName email mobileNumber')
                    .sort({ [sortBy]: sortOrder==='asc'?1:-1})
                    .skip(skip)
                    .limit(pageLimit),
                this.supplierModel.countDocuments(filter)
            ]);
            return {
                message:"Suppliers fetched successfully",
                data:suppliers,
                pagination:{
                    total,
                    page:currentPage,
                    limit:pageLimit,
                    totalPages:Math.ceil( total/pageLimit)
                }
            };
        }catch(error:any){
            throw new BadRequestException(error.message);
        }
    }
    async getPendingSuppliers(){
        try{
            const suppliers =await this.supplierModel.find({status:SupplierStatus.PENDING,isDeleted:false})
            .populate('userId','fullName email mobileNumber');
            return {
                message:"Pending suppliers fetched successfully",suppliers
            };
        }catch(error:any){
            throw new BadRequestException(error.message);
        }
    }
    async getSupplierById(supplierId:string){
        try{
            const supplier = await this.supplierModel.findOne({_id:supplierId,isDeleted:false})
            .populate('userId','fullName email mobileNumber');

            if(!supplier){
                throw new NotFoundException("supplier not found")
            }
            return{
                message:"supplier fetched succesfully",supplier
            }
        }catch(error:any){
            throw new BadRequestException(error.message)
        }
    }
    async updateSupplier(supplierId:string,dto:UpdateSupplierDto){
        try{
            const supplier =await this.supplierModel.findOne({_id:supplierId,isDeleted:false});
            if(!supplier){
                throw new NotFoundException("Supplier not found")
            }
            Object.assign(supplier,dto);
            await supplier.save();
            return {
                message:"Supplier updated successfully",supplier
            };
        }catch(error:any){
            throw new BadRequestException(error.message);
        }
    }
    
    async updateSupplierStatus(supplierId:string,dto:UpdateSupplierStatusDto,managerId:string){
        try{
            const supplier =await this.supplierModel.findOne({_id:supplierId,isDeleted:false})
            .populate("userId");
            if(!supplier){
                throw new NotFoundException("Supplier not found");
            }
            supplier.status =dto.status;
            if(dto.status ===SupplierStatus.APPROVED){
                supplier.approvedBy = new Types.ObjectId(managerId);
                supplier.approvedAt =new Date();
            }
            await supplier.save();
            const user:any = supplier.userId;
            console.log("supplier.userId:", supplier.userId);
            console.log("user:", user);
            console.log("email:", user?.email);
            await this.mailService.sendSupplierStatusMail(
            user.email,
            user.fullName,
            dto.status,
            dto.remarks
            );

            return {
                message:`Supplier ${dto.status.toLowerCase()} successfully`,supplier
            };
        }catch(error:any){
            throw new BadRequestException(error.message);
        }
    }
    async removeSupplier(supplierId:string){
        try{
            const supplier =await this.supplierModel.findOne({_id:supplierId,isDeleted:false})
            
            if(!supplier){
                throw new NotFoundException("Supplier not found");
            }
            supplier.isDeleted=true;
            supplier.deletedAt=new Date();
            await supplier.save();
            return {
                message:"Supplier deleted successfully"};
        }catch(error:any){
                throw new BadRequestException(error.message);
        }
    }


}


