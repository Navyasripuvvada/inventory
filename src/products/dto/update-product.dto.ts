import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateProductDto)
export class UpdateProductDto extends PartialType(
  CreateProductDto,
) {}