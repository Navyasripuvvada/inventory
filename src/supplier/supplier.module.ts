import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SupplierInv, SupplierSchema } from './schema/supplier.schema';
import { PurchaseOrderInv,PurchaseOrderSchema } from '../purchase/schema/purchase.schema';

import { SupplierService } from './supplier.service';
import { SuppliersController } from './supplier.controller';
import { MailModule } from 'src/email/email.module';


@Module({

  imports: [

    MongooseModule.forFeature([
      {
        name: SupplierInv.name,
        schema: SupplierSchema,
      },
      {
        name: PurchaseOrderInv.name,
        schema: PurchaseOrderSchema,
      },

    ]),
    MailModule ,

  ],
  controllers: [
    SuppliersController,
  ],


  providers: [
    SupplierService,
  ],


  exports: [
    SupplierService,
  ],

})
export class SupplierModule {}