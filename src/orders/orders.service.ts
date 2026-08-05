import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {OrderInv,OrderDocument,} from './schema/order.schema';
import {ProductInv,ProductDocument,} from '../products/schema/products.schema';
import {InventoryInv,InventoryDocument,} from '../inventory/schema/inventory.schema';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { OrderStatus } from './enum/order.enum';
import { OrderItemInv } from './schema/order-item.schema';

@Injectable()
export class OrdersService {

  constructor(

    @InjectModel(OrderInv.name)
    private readonly orderModel: Model<OrderDocument>,


    @InjectModel(ProductInv.name)
    private readonly productModel: Model<ProductDocument>,


    @InjectModel(InventoryInv.name)
    private readonly inventoryModel: Model<InventoryDocument>,

  ) {}

  async createOrder(userId: string,dto: CreateOrderDto,) {
    try{
    const orderItems: OrderItemInv[]  = [];
    let totalAmount = 0;
    for (const item of dto.items) {
        const product =await this.productModel.findById(item.productId);
        if (!product) {
            throw new NotFoundException(`Product not found ${item.productId}`,);
        }
        const inventory = await this.inventoryModel.findOne({ productId: item.productId, isDeleted: false,});
        if (!inventory) {

        throw new NotFoundException(
          `Inventory not found for ${product.name}`);
        }
        if (inventory.availableStock < item.quantity) {
            throw new BadRequestException(`Insufficient stock for ${product.name}`,);
        }
        inventory.quantity -= item.quantity;
        inventory.availableStock -= item.quantity;
        await inventory.save();
        const subtotal =product.sellingPrice * item.quantity;
         orderItems.push({
            productId: product._id,
            productName: product.name,
            quantity: item.quantity,
            unitPrice: product.sellingPrice,
            subtotal,
        });
        totalAmount += subtotal;
    }
    const orderNumber =`ORD-${Date.now()}`;
    const order =await this.orderModel.create({
        orderNumber,
        customerName:
        dto.customerName,
        customerEmail:
        dto.customerEmail,
        customerPhone:
        dto.customerPhone,
        shippingAddress:
        dto.shippingAddress,
        orderItems,
        totalAmount,
        status:OrderStatus.PENDING,
        createdBy:userId,

      });
    return{message:"Order craeted successfully", order};
    }catch(error:any){
        throw new BadRequestException(error.message)
    }

  }






  // GET ALL ORDERS


  async getOrders(query:GetOrdersQueryDto,){
        try{
            const {
            page = 1,
            limit = 10,
            status,
            search,
            } = query;
            const filter:any = {};
            if(status){
                filter.status=status;
            }
            if(search){
                filter.$or=[
                    {
                        customerName:{
                            $regex:search,
                            $options:'i'
                        }
                    },

                    {
                    orderNumber:{
                        $regex:search,
                        $options:'i'
                    }
                    }
                ];

            }
            const skip =(page - 1) * limit;
            const [orders,total] =await Promise.all([
                this.orderModel.find(filter).skip(skip).limit(limit).sort({  createdAt:-1}),
                this.orderModel.countDocuments(filter)

            ]);
            return {
                data:orders,
                pagination:{
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                }

            };
        }catch(error:any){
            throw new BadRequestException(error.message)
        }

    }
// GET SINGLE ORDER
    async getOrderById(id:string){
        try{
            const order =await this.orderModel.findById(id);
            if(!order){
                throw new NotFoundException( 'Order not found');
            }
            return {message:"order fetched successfully",order};
        }catch(error:any){
            throw new BadRequestException(error.message)
        }

    }

    // UPDATE ORDER
    async updateOrder(id:string,dto:UpdateOrderStatusDto, ){
        try{
            const order =await this.orderModel.findById(id);
            if(!order){
                throw new NotFoundException('Order not found');
            }
            Object.assign(order,dto);
            return order.save();
        }catch(error:any){
            throw new BadRequestException(error.message)
        }
    }

// CANCEL ORDER
    async cancelOrder(id:string,dto:CancelOrderDto,){
        const order = await this.orderModel.findById(id);
        if(!order){
            throw new NotFoundException('Order not found');
        }
        if(order.status === OrderStatus.CANCELLED){
            throw new BadRequestException('Order already cancelled');
        }
            // restore inventory
        for(const item of order.orderItems){
            await this.inventoryModel.findOneAndUpdate(
                {
                    productId:item.productId
                },
                {
                    $inc:{
                        quantity:item.quantity,
                        availableStock:item.quantity
                    }
                }
            );
        }
        order.status =OrderStatus.CANCELLED;
        order.isCancelled=true;
        order.cancelledAt =new Date();
        order.cancellationReason =dto.reason;
        await order.save();
        return{
            message:"order cancelled successfully",order

        } 
    }


}