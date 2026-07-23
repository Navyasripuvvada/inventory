import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  Min,
  IsString,
} from 'class-validator';

export class UpdateInventoryDto {

  @ApiPropertyOptional({
    example: 10,
    description: 'Minimum stock level for low stock alerts',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reorderLevel?: number;


  @ApiPropertyOptional({
    example: 'Hyderabad Warehouse',
    description: 'Warehouse location',
  })
  @IsString()
  @IsOptional()
  warehouse?: string;

}