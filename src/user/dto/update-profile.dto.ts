import {
  IsOptional,
  IsString,
  IsPhoneNumber,
  IsDate,
} from 'class-validator';

import {
  ApiPropertyOptional
} from '@nestjs/swagger';


export class UpdateProfileDto {

  @ApiPropertyOptional({
    example: "Navya"
  })
  @IsString()
  @IsOptional()
  fullName?: string;



  @ApiPropertyOptional({
    example: "+919876543210"
  })
  @IsPhoneNumber()
  @IsOptional()
  mobileNumber?: string;


  @ApiPropertyOptional({
    example: "2000-01-15"
  })
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;


 

  @ApiPropertyOptional({
    example: "Hyderabad, India"
  })
  @IsString()
  @IsOptional()
  address?: string;

}