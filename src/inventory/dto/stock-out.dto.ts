import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Min,
  IsString,
  IsOptional,
} from 'class-validator';


export class StockOutDto {


  @ApiProperty({
    example:'687abc123456789',
  })
  @IsMongoId()
  @IsNotEmpty()
  productId:string;


  @ApiProperty({
    example:5,
    description:'Quantity removed from stock',
  })
  @IsNumber()
  @Min(1)
  quantity:number;


  @ApiProperty({
    example:'Customer order',
    required:false,
  })
  @IsString()
  @IsOptional()
  reason?:string;

}