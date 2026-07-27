import {
Body,
Controller,
Delete,
Get,
HttpCode,
HttpStatus,
Param,
Patch,
Query,Req
} from '@nestjs/common';


import {
ApiBearerAuth,
ApiOperation,
ApiResponse,
ApiTags,
} from '@nestjs/swagger';


import { UseGuards } from '@nestjs/common';
import { SupplierService } from '../supplier/supplier.service';
import { JwtAuthGuard } from '../auth/guard/authguard.guard';
import { SupplierQueryDto } from './dto/supplier-query.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { UpdateSupplierStatusDto } from '../supplier/dto/update-status.dto';



@ApiTags('Suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('suppliers')
export class SuppliersController {
constructor(
    private readonly suppliersService:SupplierService,){}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary:'Get all suppliers'})
    async getAll(@Query() dto:SupplierQueryDto){
        return this.suppliersService.getAllSuppliers(dto);
    }



    @Get('pending')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary:'Get pending suppliers'})
    async getPending(){
        return this.suppliersService.getPendingSuppliers();
    }


    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary:'Get supplier by id'})
    async getById(@Param('id') id:string){
        return this.suppliersService.getSupplierById(id);
    }


    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary:'Update supplier'})
    async update(@Param('id') id:string,@Body() dto:UpdateSupplierDto){
        return this.suppliersService.updateSupplier(id,dto);
    }



    @Patch(':id/status')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary:'Approve or reject supplier'})
    async updateStatus(@Param('id') id:string,@Body() dto:UpdateSupplierStatusDto,@Req() req){
        return this.suppliersService.updateSupplierStatus(id,dto,req.user.userId);
    }


    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary:'Delete supplier'})
    async remove(@Param('id') id:string){
        return this.suppliersService.removeSupplier(id);
    }

}