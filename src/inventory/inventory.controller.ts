import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,Req,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { InventorySerivce } from './inventory.service';

import { JwtAuthGuard } from '../auth/guard/authguard.guard'

import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from '../inventory/dto/updateinventory.dto';
import { StockInDto } from '../inventory/dto/stockin.dto';
import { StockOutDto } from './dto/stock-out.dto';



@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {


  constructor(
    private readonly inventoryService: InventorySerivce,
  ) {}



  // CREATE INVENTORY

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({summary:'Create inventory',})
  @ApiBody({ type:CreateInventoryDto,})
  @ApiResponse({status:201,description:'Inventory created successfully',})
  async createInventory(@Req()req, @Body() dto:CreateInventoryDto,){
    return this.inventoryService.createInventory(req.user.userId,dto,);
  }

 // GET ALL INVENTORY

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'Get all inventory',})
  @ApiResponse({
    status:200,
    description:'Inventory fetched successfully',
  })
  async getAllInventory(){
    return this.inventoryService.getAllInventory();
  }
   // GET INVENTORY BY PRODUCT ID

  @Get('product/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:'Get inventory by product id',
  })
  @ApiResponse({
    status:200,
    description:'Inventory fetched successfully',
  })
  @ApiResponse({
    status:404,
    description:'Inventory not found',
  })
   async getByProduct(@Param('productId')productId:string,){
       return this.inventoryService.getByProduct( productId,);
    }








  // UPDATE INVENTORY

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:'Update inventory settings',
  })
  @ApiBody({
    type:UpdateInventoryDto,
  })
  @ApiResponse({
    status:200,
    description:'Inventory updated successfully',
  })
  async updateInventory(@Param('id')id:string,@Body()dto:UpdateInventoryDto,){
    return this.inventoryService.updateInventory(id, dto,);

  }


  // STOCK IN

  @Post('stock-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:'Add stock',
  })
  @ApiBody({
    type:StockInDto,
  })
  @ApiResponse({
    status:200,
    description:'Stock added successfully',
  })
  async stockIn(@Body()dto:StockInDto,){
    return this.inventoryService.stockIn(dto,);
}


  // STOCK OUT

  @Post('stock-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:'Remove stock',
  })
  @ApiBody({
    type:StockOutDto,
  })
  @ApiResponse({
    status:200,
    description:'Stock removed successfully',
  })
  @ApiResponse({
    status:400,
    description:'Insufficient stock',
  })
  async stockOut(@Body() dto:StockOutDto,){
    return this.inventoryService.stockOut(dto,);
 }








  // LOW STOCK PRODUCTS

  @Get('low-stock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:'Get low stock products',
  })
  @ApiResponse({
    status:200,
    description:'Low stock products fetched successfully',
  })
  async lowStock(){
    return this.inventoryService.lowStock();

  }


}