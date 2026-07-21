import {
  IsOptional,
  IsString,
  IsPhoneNumber,
  IsDateString,
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
  firstName?: string;



  @ApiPropertyOptional({
    example: "+919876543210"
  })
  @IsPhoneNumber()
  @IsOptional()
  mobileNumber?: string;


  @ApiPropertyOptional({
    example: "2000-01-15"
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;


  @ApiPropertyOptional({
    example: "https://image-url.com/profile.jpg"
  })
  @IsString()
  @IsOptional()
  profileImage?: string;


  @ApiPropertyOptional({
    example: "Hyderabad, India"
  })
  @IsString()
  @IsOptional()
  address?: string;

}