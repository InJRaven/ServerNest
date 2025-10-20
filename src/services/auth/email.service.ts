import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get<string>('MAIL_SERVER'),
        pass: this.config.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendOTPEmail(to: string, otp: string) {
    console.log(this.config.get<string>('MAIL_SERVER'));
    console.log(this.config.get<string>('MAIL_PASSWORD'));
    const mailOptions = {
      from: '"Support" <no-reply@yourapp.com>',
      to,
      subject: 'Account Verification - OTP Code',
      html: `
      <p>Hello,</p>
      <p>Your OTP code is: <b>${otp}</b></p>
      <p>This code is valid for 5 minutes.</p>
    `,
    };
    const info = await this.transporter.sendMail(mailOptions);
    console.log(`[Email] OTP sent to ${to}, messageId: ${info.messageId}`);
  }
}
