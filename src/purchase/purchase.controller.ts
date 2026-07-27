import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PurchaseOrderService } from '../purchase/purchase.services';

import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';

import { UpdatePoStatusDto } from './dto/update-po-status.dto';

import { JwtAuthGuard } from '../auth/guard/authguard.guard';



@ApiTags('Purchase Orders')
@ApiBearerAuth()
@Controller('purchase-orders')
@UseGuards(JwtAuthGuard)
export class PurchaseOrdersController {
    constructor(
        private readonly purchaseOrdersService: PurchaseOrderService,
   ){}



  // CREATE PURCHASE ORDER

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create purchase order'
  })
  @ApiResponse({
    status: 201,
    description: 'Purchase order created successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Supplier or product not found'
  })
  async createPurchaseOrder(
    @Body() dto: CreatePurchaseOrderDto,
    @Req() req,
  ) {

    const userId = req.user.userId;


    return this.purchaseOrdersService
      .createPurchaseOrder(
        dto,
        userId,
      );

  }




  // GET ALL PURCHASE ORDERS

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:'Get all purchase orders'
  })
  @ApiResponse({
    status:200,
    description:'Purchase orders fetched successfully'
  })
  async getAllPurchaseOrders(){

    return this.purchaseOrdersService
      .getAllPurchaseOrders();

  }




  // GET PURCHASE ORDER BY ID

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:'Get purchase order by id'
  })
  @ApiResponse({
    status:200,
    description:'Purchase order found'
  })
  @ApiResponse({
    status:404,
    description:'Purchase order not found'
  })
  async getPurchaseOrderById(
    @Param('id') id:string,
  ){

    return this.purchaseOrdersService
      .getPurchaseOrderById(id);

  }




  // UPDATE STATUS

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:'Update purchase order status'
  })
  @ApiResponse({
    status:200,
    description:'Purchase order status updated'
  })
  @ApiResponse({
    status:404,
    description:'Purchase order not found'
  })
  async updateStatus(
    @Param('id') id:string,
    @Body() dto:UpdatePoStatusDto,
  ){

    return this.purchaseOrdersService
      .updateStatus(
        id,
        dto,
      );

  }




}