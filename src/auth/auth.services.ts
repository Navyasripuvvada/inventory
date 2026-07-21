import {Injectable,UnauthorizedException,ConflictException, Inject, BadRequestException, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';



import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { randomUUID } from 'crypto';



import { UserInv,UserDocument } from '../user/schema/user.schema';
import { SessionInv,SessionDocument, SessionStatus } from '../user/schema/session.schema';
import { MailService } from '../email/email.service'
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { generateOtp } from '../common/utils/otp.utils';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from '../auth/dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

const OTP_EXPIRY_MINUTES = 10;
const BCRYPT_ROUNDS = 12;


@Injectable()
export class AuthService{
    constructor(
        @InjectModel(UserInv.name)
        private readonly userModel:Model<UserDocument>,
        @InjectModel(SessionInv.name)
        private readonly sessionModel:Model<SessionDocument>,
        private readonly mailService:MailService,
        private readonly jwtService:JwtService
    ){}
    
    async regsiterUser(dto:RegisterDto){
        try{
        const [emailExists,mobileExists] = await Promise.all([
            this.userModel.findOne({email:dto.email.toLowerCase()}),
            this.userModel.findOne({mobileNumber:dto.mobileNumber})
        ])
        if(emailExists){
            throw new ConflictException("user email is already registered")
        }

        if(mobileExists){
            throw new ConflictException("mobile number already exists")
        }

        const hashedPassword = await bcrypt.hash(dto.password,BCRYPT_ROUNDS)
        const emailOtpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

        const otp = generateOtp()

        const user = await this.userModel.create({
            fullName:dto.fullName,
            email:dto.email,
            password:hashedPassword,
            mobileNumber:dto.mobileNumber,
            emailOtp:otp,
            otpExpiry: emailOtpExpiry

        })
        await this.mailService.sendOtpEmail(user.email,otp)
        console.log(`otp sent to ${user.email}`)
        return{
            message:"OTP sent to email. Verify your account"
           
        }

    }catch(error:any){
        throw new BadRequestException(error.message)
    }
    }

    async VerifyEmail(dto:VerifyEmailDto){
        try{
            const user = await this.userModel.findOne({email:dto.email})
            if(!user){
                throw new NotFoundException("user not found")
            }
            if(user.isEmailVerified){
                throw new BadRequestException("email already verified")
            }
            if(user.emailOtp !== dto.otp){
                throw new BadRequestException('invalid otp')

            }
             if (
                !user.otpExpiry ||
                user.otpExpiry < new Date()
            ) {
                throw new BadRequestException(
                'OTP expired',
                );
            }

            user.isEmailVerified=true,
            user.emailOtp=null,
            user.otpExpiry=null
            await user.save();
            return{
                message:"email verified successfully"
            }
        

        }catch(error:any){
            throw new BadRequestException(error.message)
        }

    }
    async Login(dto:LoginDto,req: Request){
        try{
        const user = await this.userModel.findOne({email:dto.email})
        if(!user){
            throw new NotFoundException("User not found")
        }
        if(!user.isEmailVerified){
            throw new UnauthorizedException("Verify Email First")
        }
        console.log("DTO password:", dto.password);
        console.log("DB password:", user.password);
        const isMatch = await bcrypt.compare(dto.password,user.password)
        if(!isMatch){
            throw new UnauthorizedException("password is not correct")
        }
        const sessionId = randomUUID();
        const session = await this.sessionModel.create({
            sessionId,
            userId:user._id,
            status:SessionStatus.ACTIVE,
            isActive:true,
            userAgent:req.headers['user-agent'] || null,
            ipAddress:req.ip || null,
            expiresAt:new Date(Date.now()+7*24*60*60*1000)

        })
        const payload = {
            sub:user._id.toString(),
            sessionId:session.sessionId,
            role: user.role,
        }
        const accessToken = await this.jwtService.sign(payload,{secret:process.env.ACCESS_SECRET_KEY,expiresIn:'15m'})
        const refreshToken = await this.jwtService.sign(payload,{secret:process.env.REFRESH_SECRET_KEY,expiresIn:'7d'})
        const hashedRefreshToken = await bcrypt.hash(refreshToken,BCRYPT_ROUNDS);
        session.refreshTokenExpiresAt =new Date(Date.now()+7*24*60*60*1000);
        session.refreshToken = hashedRefreshToken,
        await session.save();
        return{
            message:"login successfull",
            accessToken,
            refreshToken,
            sessionId,
            user:{
                id:user._id,
                name:user.fullName,
                email:user.email,
                role: user.role,
               
            }
        }
        }catch(error:any){
            throw new BadRequestException(error.message)

        }
    }
    async refresh(dto:RefreshTokenDto){
        try{
            const payload=  await this.jwtService.verify(dto.refreshToken,{
                secret:process.env.REFRESH_SECRET_KEY
            });
            const session = await this.sessionModel.findOne({sessionId:payload.sessionId})
             if (!session) {
                throw new UnauthorizedException('Session not found',);
            }
            if ( !session.isActive || session.status !== SessionStatus.ACTIVE) {
                 throw new UnauthorizedException( 'Session expired', );
            }
            if(!session.refreshToken){
                throw new NotFoundException("refresh token not found")
            }
            const isValidRefreshToken = await bcrypt.compare(dto.refreshToken,session.refreshToken);
            if(!isValidRefreshToken){
                throw new UnauthorizedException("refresh token is not valid")
            }
            const newAccessToken = await this.jwtService.sign({
                payload:payload.sub,
                sessionId: session.sessionId,
                role: payload.role,
                },
                {
                secret:process.env.ACCESS_SECRET_KEY,
                expiresIn: '15m',
                })
            return{
                message:'new access token generated successfully',
                accessToken:newAccessToken
            }
        }catch(error:any){
            throw new BadRequestException(error.message)
        }
    }
   async logout(sessionId: string) {
        try{
        await this.sessionModel.findOneAndUpdate( { sessionId },{
            isActive: false,
            status: SessionStatus.LOGGED_OUT,
            loggedOutAt: new Date(),
            logoutReason: 'User logout',
            refreshToken: null,
            });
            return {message: 'Logged out successfully' };
        }catch(error:any){
            throw new BadRequestException(error.message)
        }
    }
    async logoutAll(userId: string) {
        try{
           await this.sessionModel.updateMany(
            {
                userId,
                 isActive:true,
            },
            {
                $set:{
                    isActive:false,
                    status:SessionStatus.LOGGED_OUT,
                    loggedOutAt:new Date(),
                    logoutReason:'Logout from all devices',
                    refreshToken:null,
                }
            });
            return {message:'Logged out from all devices successfully'};
        }catch(error:any){
            throw new BadRequestException(error.message)
        }
    }
    async forgotpassword(dto:ForgotPasswordDto){
        try{
            const user = await this.userModel.findOne({email:dto.email})
            if(!user){
                throw new NotFoundException("email not found")

            }
            const token = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = new Date( Date.now() + 60 * 60 * 1000,);
            await user.save();
            await this.mailService.sendResetPasswordEmail(
                user.email,
                user.fullName,
                token,
             );
             return {
                message: 'Password reset link sent successfully',token
            };
        }catch(error:any){
            throw new BadRequestException(error.message)
        }
    }
    async resetPassword(dto:ResetPasswordDto) {
        try{
            const user = await this.userModel.findOne({resetPasswordToken: dto.resetPasswordToken});
            if (!user) {
                throw new BadRequestException('Invalid reset token');
            }
            if (
                user.resetPasswordExpires &&
                user.resetPasswordExpires < new Date()) {
                    throw new BadRequestException('Reset token has expired');
                }
                if (dto.newPassword !== dto.confirmPassword) {
                    throw new BadRequestException('New password and confirm password do not match');
                }

    

                const hashedPassword = await bcrypt.hash(dto.newPassword,BCRYPT_ROUNDS);
                user.password = hashedPassword;
                 user.resetPasswordToken = null;
                 user.resetPasswordExpires = null;
                 await user.save();
                 return {
                    message: 'Password reset successfully'
                };
            }catch(error:any){
                    throw new BadRequestException(error.message)
            }
    }
    async resendOtp(dto:ResendOtpDto) {
        try {

            const user = await this.userModel.findOne({email: dto.email});
            if (!user) {
            throw new NotFoundException('User not found');
            }
            if (user.isEmailVerified) {
            throw new BadRequestException('Email already verified');
            }

            const otp =generateOtp()
            user.emailOtp = otp;
            const emailOtpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
            user.otpExpiry=emailOtpExpiry
            await user.save();
            await this.mailService.sendOtpEmail(user.email,otp);

            return {
            message: 'OTP sent successfully',
            };

        } catch (error: any) {
            throw new BadRequestException(error.message);
        }
    }
        

}
 

