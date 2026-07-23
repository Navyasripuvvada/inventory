import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Min,
  IsString,
  IsOptional,
} from 'class-validator';


export class StockInDto {


  @ApiProperty({
    example:'687abc123456789',
    description:'Product ID',
  })
  @IsMongoId()
  @IsNotEmpty()
  productId:string;


  @ApiProperty({
    example:50,
    description:'Quantity added to inventory',
  })
  @IsNumber()
  @Min(1)
  quantity:number;


  @ApiProperty({
    example:'Supplier delivery',
    required:false,
  })
  @IsString()
  @IsOptional()
  reason?:string;

}