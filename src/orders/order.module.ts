import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersController } from '../orders/order.controller';
import { OrdersService } from './orders.service';


import {
  OrderInv,
  OrderSchema,
} from './schema/order.schema';


import {
  ProductInv,
  ProductSchema,
} from '../products/schema/products.schema';


import {
  InventoryInv,
  InventorySchema,
} from '../inventory/schema/inventory.schema';



@Module({

imports:[

 MongooseModule.forFeature([

  {
    name:OrderInv.name,
    schema:OrderSchema,
  },


  {
    name:ProductInv.name,
    schema:ProductSchema,
  },


  {
    name:InventoryInv.name,
    schema:InventorySchema,
  }

 ])

],


controllers:[
 OrdersController
],


providers:[
 OrdersService
],


exports:[
 OrdersService
]

})
export class OrdersModule {}