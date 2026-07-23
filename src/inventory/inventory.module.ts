import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InventoryInv, InventorySchema } from './schema/inventory.schema';
import { ProductInv, ProductSchema } from '../products/schema/products.schema';
import { UserInv, UserSchema } from '../user/schema/user.schema';

import { InventorySerivce } from './inventory.service';
import { InventoryController } from './inventory.controller';


@Module({
  imports: [

    MongooseModule.forFeature([
      {
        name: InventoryInv.name,
        schema: InventorySchema,
      },

      {
        name: ProductInv.name,
        schema: ProductSchema,
      },

      {
        name: UserInv.name,
        schema: UserSchema,
      },

    ]),

  ],

  controllers:[
    InventoryController,
  ],

  providers:[
    InventorySerivce,
  ],

  exports:[
    InventorySerivce,
  ],

})
export class InventoryModule {}