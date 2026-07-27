import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class AssignProductsDto {
  @ApiProperty({
    example: [
      '687abc123456789012345678',
      '687abc123456789012345679',
    ],
    description: 'Product IDs',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  productIds: string[];
}