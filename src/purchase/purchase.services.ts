import { BadRequestException, Injectable, NotFoundException,} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types,} from 'mongoose';

import {PurchaseOrderInv,PurchaseOrderDocument,} from '../purchase/schema/purchase.schema';
import { CreatePurchaseOrderDto,} from './dto/create-purchase-order.dto';
import {UpdatePoStatusDto,} from './dto/update-po-status.dto';
import {SupplierInv,SupplierDocument  } from '../supplier/schema/supplier.schema';
import {ProductInv,ProductDocument,} from '../products/schema/products.schema';
@Injectable()
export class PurchaseOrderService{
    constructor(
        @InjectModel(SupplierInv.name)
        private readonly supplierModel:Model<SupplierDocument>,
        @InjectModel(ProductInv.name)
        private readonly productModel:Model<SupplierDocument>,
        @InjectModel(PurchaseOrderInv.name)
        private readonly purchaseOrderModel:Model<PurchaseOrderDocument>,
    ){}

    
  async createPurchaseOrder(dto: CreatePurchaseOrderDto,userId: string,) {
    try{
        const supplier =await this.supplierModel.findById(dto.supplierId);
        if(!supplier){
            throw new NotFoundException('Supplier not found');
        }
        let totalAmount = 0;
        const orderItems : {
                product: Types.ObjectId;
                quantity: number;
                costPrice: number;
                }[] = [];
        for(const item of dto.items){
            const product =await this.productModel.findById(  item.productId);
            if(!product){
                throw new NotFoundException(`Product not found: ${item.productId}`);
            }
            totalAmount +=item.quantity * item.costPrice;
            orderItems.push({product:new Types.ObjectId( item.productId),
                quantity:item.quantity,
                costPrice:item.costPrice,

        });
        }
            const purchaseOrder = await this.purchaseOrderModel.create({
                supplier:new Types.ObjectId( dto.supplierId ),
                items:orderItems,
                totalAmount,
                createdBy:new Types.ObjectId(  userId),
            });
            return {
                message:'Purchase order created successfully',purchaseOrder,
            };
        }catch(error:any){
            throw new BadRequestException(error.message)
        }
    }





  // GET ALL PURCHASE ORDERS
    async getAllPurchaseOrders(){
        return await this.purchaseOrderModel
        .find()
        .populate( 'supplier')
        .populate('items.product')
        .populate( 'createdBy', 'name email')
        .sort({ createdAt:-1});
    }
     async getPurchaseOrderById(
    id:string
  ){


    const purchaseOrder =
      await this.purchaseOrderModel

      .findById(id)

      .populate(
        'supplier'
      )

      .populate(
        'items.product'
      )

      .populate(
        'createdBy',
        'name email'
      );



    if(!purchaseOrder){

      throw new NotFoundException(
        'Purchase order not found'
      );

    }



    return purchaseOrder;

  }






  // UPDATE PURCHASE ORDER STATUS
   async updateStatus(id:string,dto:UpdatePoStatusDto){
    const purchaseOrder = await this.purchaseOrderModel.findById(id);
    if(!purchaseOrder){
        throw new NotFoundException('Purchase order not found');
    }
    purchaseOrder.status =dto.status;
    await purchaseOrder.save();
    return {
        message:'Purchase order status updated successfully', purchaseOrder,

    };


  }





  // GET SUPPLIER PURCHASE ORDERS


    async getSupplierOrders(supplierId:string){
        return await this.purchaseOrderModel.find({supplier:new Types.ObjectId(  supplierId)})
        .populate('items.product')
        .sort({ createdAt:-1});
    }



}







    




