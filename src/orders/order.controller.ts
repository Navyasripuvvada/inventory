import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';


import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';


import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guard/authguard.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';



@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {


constructor(
 private readonly ordersService: OrdersService,
){}

// CREATE ORDER

@Post()
@HttpCode(HttpStatus.CREATED)
@ApiOperation({ summary:'Create order',})
@ApiBody({type:CreateOrderDto,})
@ApiResponse({status:201,description:'Order created successfully',})
async createOrder(@Req() req,@Body() dto:CreateOrderDto,){
    return this.ordersService.createOrder(req.user.userId,dto,);
}


// GET ALL ORDERS

@Get()
@HttpCode(HttpStatus.OK)
@ApiOperation({summary:'Get all orders',})
@ApiResponse({status:200,description:'Orders fetched successfully',})
async getOrders(@Query() query:GetOrdersQueryDto){
    return this.ordersService.getOrders(query);
}


// GET ORDER BY ID

@Get(':id')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary:'Get order by id',})
@ApiResponse({ status:200,description:'Order fetched successfully',})
@ApiResponse({status:404,description:'Order not found',})
async getOrderById(@Param('id') id:string,){
    return this.ordersService.getOrderById(id);
}

// UPDATE ORDER STATUS

@Patch(':id')
@HttpCode(HttpStatus.OK)
@ApiOperation({summary:'Update order status',})
@ApiBody({type:UpdateOrderStatusDto,})
@ApiResponse({status:200,description:'Order updated successfully',})
@ApiResponse({status:404,description:'Order not found',})
async updateOrderStatus(@Param('id') id:string,@Body() dto:UpdateOrderStatusDto,){
    return this.ordersService.updateOrder(id,dto,);

}


// CANCEL ORDER

@Patch(':id/cancel')
@HttpCode(HttpStatus.OK)
@ApiOperation({summary:'Cancel order',})
@ApiBody({type:CancelOrderDto,})
@ApiResponse({status:200,description:'Order cancelled successfully',})
@ApiResponse({ status:404,description:'Order not found',})
@ApiResponse({status:400,description:'Order already cancelled',})
async cancelOrder(@Param('id') id:string,@Body() dto:CancelOrderDto,){
    return this.ordersService.cancelOrder(id,dto, );
}


}