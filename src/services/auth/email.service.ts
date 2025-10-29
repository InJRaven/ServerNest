import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: this.config.get<string>('MAIL_SERVER'),
        pass: this.config.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendOTPEmail(to: string, otp: string) {
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
    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `[Email] OTP sent to ${to} - MessageID: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `[Email] Failed to send OTP to ${to}: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to send OTP email.');
    }
  }
}
