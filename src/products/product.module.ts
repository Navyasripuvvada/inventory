import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsController } from '../products/product.controller';
import { ProductsServices } from './products.service';

import {ProductInv,ProductSchema,} from './schema/products.schema';


@Module({

  imports: [
    MongooseModule.forFeature([
      {
        name: ProductInv.name,
        schema: ProductSchema,
      },
    ]),
  ],


  controllers: [
    ProductsController,
  ],


  providers: [
    ProductsServices,
  ],


  exports: [
    ProductsServices,
  ],

})
export class ProductsModule {}