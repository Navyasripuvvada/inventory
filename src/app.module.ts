import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import {ConfigModule} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UploadsModule } from './uploads/upload.module';
import { ProductsModule } from './products/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { SupplierModule } from './supplier/supplier.module';
import { PurchaseOrdersModule } from './purchase/purchase.module';
import { OrdersModule } from './orders/order.module';


@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGODB_URI');

        console.log('MONGODB_URI =', mongoUri);

        return {
          uri: mongoUri,
        };
      },
    }),
  AuthModule,
  UserModule,
  UploadsModule,
  ProductsModule,
  InventoryModule,
  SupplierModule,
  PurchaseOrdersModule,
  OrdersModule,
 
 ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
