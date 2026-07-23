import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { InventoryInv,InventoryDocument,} from './schema/inventory.schema';
import {ProductInv,ProductDocument,} from '../products/schema/products.schema';

import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from '../inventory/dto/updateinventory.dto';
import { StockInDto } from '../inventory/dto/stockin.dto';
import { StockOutDto } from './dto/stock-out.dto';

@Injectable()
export class InventorySerivce{
constructor( 
    @InjectModel(InventoryInv.name)
     private readonly inventoryModel :Model<InventoryDocument>,
     @InjectModel(ProductInv.name)
     private readonly productModel:Model<ProductDocument>
     ){}

     async createInventory(userId:string,dto:CreateInventoryDto){
        try{
            const product = await this.productModel.findOne({_id:dto.productId,isDeleted:false})
            if(!product){
                throw new NotFoundException("product not found")
            }
            const existingInventory = await this.inventoryModel.findOne({productId:dto.productId})
            if(existingInventory){
                throw new ConflictException("Inventory already exists for this product")
            }
            const inventory =await this.inventoryModel.create({
                 productId:dto.productId,
                 quantity:dto.quantity,
                 availableStock:dto.quantity,
                 reservedStock:0,
                 reorderLevel:dto.reorderLevel ?? 10,
                 warehouse:dto.warehouse ?? "Main Warehouse",
                 createdBy:userId,

            });
            return{
                message:'Inventory created successfully',inventory
            }


        }catch(error:any){
            throw new BadRequestException(error.message)
        }
    }
    async getAllInventory(){
        try{
            const inventory = await this.inventoryModel.find({isDeleted:false})
            .populate('productId','name sku sellingPrice');
            return {
                message:'Inventory fetched Successfully',
                inventory
            }
            
        }catch(error:any){
            throw new BadRequestException(error.message)
        }




    }
    async getByProduct(productId:string){
        try{
            const inventory =await this.inventoryModel.findOne({productId,isDeleted:false,})
            .populate('productId');
            if(!inventory){
                throw new NotFoundException("Inventory not found");
            }
            return {
            message:'Inventory fetched Successfully',inventory
            }
        }catch(error:any){
            throw new BadRequestException(error.message)
        }
    }
    async updateInventory( inventoryId:string, dto:UpdateInventoryDto,){
        try{
            const inventory =await this.inventoryModel.findOne({_id:inventoryId,isDeleted:false, });
            if(!inventory){
                throw new NotFoundException("Inventory not found");
            }
            const updatedInventory =await this.inventoryModel.findByIdAndUpdate(inventoryId,dto,{
                new:true,
                runValidators:true,});

            return{
                message:"Inventory updated successfully",
                inventory:updatedInventory,
             };
        }catch(error:any){
            throw new BadRequestException("error.message")
        }
    }
    async stockIn(dto: StockInDto){

        try {

            const inventory =await this.inventoryModel.findOneAndUpdate(

                {
                productId: dto.productId,
                isDeleted:false,
                },

                {
                $inc:{
                    quantity:dto.quantity,
                    availableStock:dto.quantity,
                }
                },

                {
                new:true
                }

            );


            if(!inventory){
            throw new NotFoundException(
                "Inventory not found"
            );
            }


            return {
            message:"Stock added successfully",
            inventory
            };


        }catch(error:any){

            throw new BadRequestException(
            error.message
            );

        }

    }
    async stockOut(dto: StockOutDto){
        try{
            const inventory =await this.inventoryModel.findOneAndUpdate(
                {
                    productId: dto.productId,
                    availableStock:
                    {
                        $gte:dto.quantity
                    },
                },

                {
                $inc:{
                    quantity:-dto.quantity,
                    availableStock:-dto.quantity,
                }
                },

                {
                new:true
                }

                );
            if(!inventory){
                throw new BadRequestException("Insufficient stock");
            }
            return {
                message:"Stock removed successfully",
                inventory
            };
        }catch(error:any){
            throw new BadRequestException(error.message)
        }
    }
    async lowStock(){
        try{
            const inventory =await this.inventoryModel.find({isDeleted:false,
                $expr:{
                $lte:[
                "$availableStock",
                "$reorderLevel"
                ]
            }

            })
            .populate(
            'productId',
            'name sku'
            );
            return{
                message:"Low stock products",inventory,};
        }catch(error:any){
            throw new BadRequestException(error.message)
        }
    }
}






