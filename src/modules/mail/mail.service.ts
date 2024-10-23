import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nguyenxuanvu0307.tx@gmail.com',
        pass: 'Xuanvu0307@@@',
      },
    });
  }

  async sendPasswordChangeEmail(email: string) {
    const mailOptions = {
      from: 'nguyenxuanvu0307.tx@gmail.com',
      to: email,
      subject: 'Password Change Confirmation',
      text: 'Your password has been successfully changed',
    };
    return await this.transporter.sendMail(mailOptions);
  }

  async sendForgotPasswordEmail(email: string, resetPasswordUrl: string) {
    const mailOptions = {
      from: 'nguyenxuanvu0307.tx@gmail.com',
      to: email,
      subject: 'Reset Your Password',
      text: `Your requested to reset your password. Please click the following link to reset your password: ${resetPasswordUrl}`,
    };
    return await this.transporter.sendMail(mailOptions);
  }

  async sendConfirmationEmail(email: string, confirmationUrl: string) {
    const mailOptions = {
      from: 'nguyenxuanvu0307.tx@gmail.com',
      to: email,
      subject: 'Confirm your account',
      template: './confirmation',
      context: {
        confirmationUrl,
      },
    };
    return await this.transporter.sendMail(mailOptions);
  }
}
