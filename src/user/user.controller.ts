import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,HttpCode,HttpStatus,UseInterceptors,UploadedFile
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,ApiConsumes,ApiBody,
} from '@nestjs/swagger';

import { Request } from 'express';

import { UserService } from '../user/user.service';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';

import { JwtAuthGuard } from '../auth/guard/authguard.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserRole } from './schema/user.schema';
import { Roles } from 'src/auth/decorator/roles.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {

  constructor(
    private readonly usersService: UserService,
  ) {}



  // Get logged-in user profile
  @ApiBearerAuth()
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary:'Get current user profile'})
  async getProfile(@Req() req,){
    console.log(req.user)
    return this.usersService.getme(req.user.userId);
   }




  // Update own profile
  @ApiBearerAuth()
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'Update current user profile'})
  async updateProfile(@Req() req,@Body() dto:UpdateProfileDto,){
    return this.usersService.updateProfile(req.user.userId,dto,);
  }





  // Manager/Admin get all users
  @Roles(UserRole.MANAGER)
  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @ApiOperation({summary:'Get all users with search and filters'})
  async findAll(@Query() dto:GetUsersDto,){
    return this.usersService.findAll(dto);
  }





  // Manager Get user by id

  @Roles(UserRole.MANAGER)
  @ApiBearerAuth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'Get user by id'})
  async findOne(@Param('id') id:string,){
    return this.usersService.getById(id);
  }





  // Admin update user
  @Roles(UserRole.MANAGER)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'Admin update user'})
  async updateUser(@Param('id') id:string,@Body() dto:UpdateUserDto,){
    return this.usersService.updateProfileByManager(id,dto,);

  }



  // Delete own account
  @ApiBearerAuth()
  @Delete('account')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'Delete current user account'})
  async deleteAccount(@Req() req,){
    return this.usersService.deleteAccount(req.user.sub);

  }

   
}