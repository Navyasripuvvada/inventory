import {Injectable} from '@nestjs/common';
import { info } from 'console';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService{
    private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  async sendOtpEmail(
    email: string,
    otp:string
  ) {
    try {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Otp for verification',
      html:`<h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>`
    });
    console.log('Mail sent:', info);
     } catch (error) {
    console.error('Mail Error:', error);
  }
  }
  async sendResetPasswordEmail(
    email: string,
    fullName: string,
    token: string,
  ) {
    try {
      const resetLink =
        `https://localhost:3000/reset-password?token=${token}`;

      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Your Password',
        html: `
          <h2>Hello ${fullName}</h2>
          <p>You requested a password reset.</p>
          <p>Click the link below to reset your password:</p>

          <a href="${resetLink}">
            Reset Password
          </a>

          <p>This link expires in 1 hour.</p>
        `,
      });

      console.log('Mail sent:', info);
    } catch (error) {
      console.error('Mail Error:', error);
    }
  }
}