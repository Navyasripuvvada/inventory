import { Controller, Post, Body,UseGuards,Req ,HttpCode,HttpStatus} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { AuthService } from './auth.services';
import { JwtAuthGuard } from './guard/authguard.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register a new user account' })
  async login(@Body() dto: RegisterDto) {
    return await  this.authService.regsiterUser(dto);
  }
   
   @Post('verify')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({summary:'verify email'})
   async verifyEmail(@Body() dto:VerifyEmailDto){
    return await this.authService.VerifyEmail(dto)
   }

   @Post('login')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({summary:'login into account'})
   async Login(@Body() dto:LoginDto, @Req() req:Request,){
    return await this.authService.Login(dto,req)
   }


   @ApiBearerAuth()
   @Post('refresh')
   @HttpCode(HttpStatus.OK)
   @UseGuards(JwtAuthGuard)
   @ApiOperation({summary:'new access token'})
   async Refresh(@Body() dto:RefreshTokenDto){
     return await this.authService.refresh(dto)
   }

   @ApiBearerAuth()
   @Post('logout')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({summary:'logout from current device'})
   @UseGuards(JwtAuthGuard)
   async logout(@Req() req: any){
    return this.authService.logout(req.user.sessionId,);

  }

  @ApiBearerAuth()
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'logout from all devices'})
  @UseGuards(JwtAuthGuard)
  async logoutAll(@Req() req:any){
    return this.authService.logoutAll(req.user.userId,);
  }

  
  @Post('forgot-password')
   @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'Send password reset link'})
  async forgotPassword(@Body() dto:ForgotPasswordDto) {
  return this.authService.forgotpassword(dto);
  }


 
  @Post('reset-password')
   @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'Reset password using token'})
   async resetPassword(@Body() dto:ResetPasswordDto,) {
    return this.authService.resetPassword(dto);
  }
  @Post('resend-otp')
   @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'Reset password using token'})
  async resendOtp(@Body() dto:ResendOtpDto){
    return this.authService.resendOtp(dto);
  }


 
  
}