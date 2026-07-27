import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';


export enum SupplierStatus {

  PENDING = 'PENDING',

  APPROVED = 'APPROVED',

  REJECTED = 'REJECTED',

}


export class UpdateSupplierStatusDto {


  @ApiProperty({
    enum: SupplierStatus,
    example: SupplierStatus.APPROVED
  })
  @IsEnum(SupplierStatus)
  status: SupplierStatus;



  @ApiProperty({
    example:'Documents verified'
  })
  @IsOptional()
  @IsString()
  remarks?: string;

}