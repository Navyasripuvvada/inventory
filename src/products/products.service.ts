import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  Model } from 'mongoose';

import { Product, ProductDocument } from '../products/schema/products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from '../products/dto/query-product.dto';
@Injectable()
export class ProductsServices{
    constructor(
        @InjectModel(Product.name)
        private readonly productModel:Model<ProductDocument>,
    ){}

    async creatingProduct(userId:string,dto:CreateProductDto){
        

    }
}