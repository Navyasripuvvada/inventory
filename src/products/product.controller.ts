import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ProductsServices } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/query-product.dto';

import { JwtAuthGuard } from '../auth/guard/authguard.guard';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController{
    constructor(
        private readonly productsServices:ProductsServices
    ){}
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary: 'Create a new product', })
    async createProduct(@Req() req,@Body() dto:CreateProductDto){
        return  this.productsServices.creatingProduct(req.user.userId,dto)

    }


    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary:'get all products'})
    async getAllProducts(@Query() dto:ProductQueryDto){
        return   this.productsServices.getAll(dto)
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary:'get product by Id'})
    async getById(@Param('id') productId:string){
        return this.productsServices.getById(productId)
    }


    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary:'Update Product'})
    async updateProduct(@Param('id') productId:string,@Body() dto:UpdateProductDto){
        return this.productsServices.updateProduct(productId,dto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary:'Delete Product'})
    async DeleteProduct(@Param() productId:string){
        return this.productsServices.remove(productId)

    }
}