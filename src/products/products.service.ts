import {
    BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  Model } from 'mongoose';

import { ProductInv, ProductDocument } from '../products/schema/products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from '../products/dto/query-product.dto';
@Injectable()
export class ProductsServices{
    constructor(
        @InjectModel(ProductInv.name)
        private readonly productModel:Model<ProductDocument>,
    ){}

    private async generateSku(category: string,): Promise<string> {
        const prefix = category ? category.substring(0, 3).toUpperCase(): 'PRO';
        const count =await this.productModel.countDocuments();
        return `${prefix}-${String( count + 1,).padStart(5, '0')}`;
    }

    async creatingProduct(userId:string,dto:CreateProductDto){
        try{
            const sku = await this.generateSku(dto.category);
            const existingProduct = await this.productModel.findOne({sku})
            if(existingProduct){
                throw new ConflictException("Product already exists")
            }
            const product =new this.productModel({ ...dto,
                sku,
                createdBy: userId,
                isActive: true,
            });
            await product.save();
            return{
                 message:'product created successfully',product
            } 
        }catch(error:any){
            throw new BadRequestException(error.message)
        }
    }
    async getAll(dto:ProductQueryDto){
        try{

            const {
                page = '1',
                limit = '10',
                search,
                category,
                isActive,
                sortBy = 'createdAt',
                sortOrder = 'desc',
                } = dto;
            let filters:any={}
            filters.isDeleted = false;
            if(search){
                filters.$or=[
                    {
                        name:{
                            $regex:search,
                            $options:'i'
                        }
                    },
                    {
                        sku:{
                            $regex:search,
                            $options:'i'

                        }
                    }

                ]
            }
            if(category){
                filters.category = category;
            }
            if(isActive !==undefined){
                filters.isActive =isActive === 'true';
            }
            const currentPage = Number(page);
            const pageLimit = Number(limit);
            const skip =( currentPage-1)*pageLimit;
            const [products, total] = await Promise.all([
                this.productModel
                    .find(filters)
                    .sort({
                    [sortBy]:
                        sortOrder === 'asc' ? 1 : -1,
                    })
                    .skip(skip)
                    .limit(pageLimit),

                this.productModel.countDocuments(filters),
            ]);
            return {
                    data: products,
                    pagination: {
                        total,
                        page: currentPage,
                        limit: pageLimit,
                        totalPages: Math.ceil(total / pageLimit,),
                    },
                };
            }catch(error:any){
                throw new BadRequestException(error.message)
            }
    }
    async getById(productId:string){
        try{
            const product = await this.productModel.findOne({_id:productId, isDeleted: false,})
            if(!product){
                throw new NotFoundException("product not found")
            }
            return {
                message:'product fetched successfully',
                product
            }


        }catch(error:any){
            throw new BadRequestException(error.message)
        }
       

    }
    async updateProduct(productId:string,dto:UpdateProductDto){
        try{
            const product = await this.productModel.findOne({_id:productId,isDeleted: false,})
            if(!product){
                throw new NotFoundException("Product not Found")
            }
           const updatedProduct = await this.productModel.findByIdAndUpdate(productId,dto,{new:true, runValidators: true,});
           return{
            message:'product updated successfully',
            updatedProduct,
           }
           


        }catch(error:any){
            throw new BadGatewayException(error.message)
        }
    }
        
     async remove(productId: string,) {
        try{
            const product =await this.productModel.findOne({ productId, isDeleted: false,});
            if (!product) {
            throw new NotFoundException( 'Product not found',);
            }
            await this.productModel.findByIdAndUpdate(productId,{  isDeleted: true, deletedAt: new Date(),},);
            return {
                message:'Product deleted successfully'
            }  
        }catch(error:any){
            throw new BadRequestException(error.message)
        }
    }
}

        

    
