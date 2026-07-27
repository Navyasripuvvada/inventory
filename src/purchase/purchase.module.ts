import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


import { PurchaseOrdersController } from '../purchase/purchase.controller';
import { PurchaseOrderService } from '../purchase/purchase.services';
import { PurchaseOrderInv, PurchaseOrderSchema,} from '../purchase/schema/purchase.schema';
import { SupplierInv, SupplierSchema,} from '../supplier/schema/supplier.schema';
import { ProductInv, ProductSchema,} from '../products/schema/products.schema';



@Module({

  imports: [

    MongooseModule.forFeature([
        {
        name: PurchaseOrderInv.name,
        schema: PurchaseOrderSchema,
       },


      {
        name: SupplierInv.name,
        schema: SupplierSchema,
      },


      {
        name: ProductInv.name,
        schema: ProductSchema,
      },

    ]),

  ],



  controllers: [PurchaseOrdersController,],
   providers: [PurchaseOrderService, ],
   exports: [PurchaseOrderService,],
})
export class PurchaseOrdersModule {}