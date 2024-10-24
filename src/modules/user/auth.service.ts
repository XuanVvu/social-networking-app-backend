import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/LoginUser.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  async register(requestBody: RegisterUserDto) {
    // check email is exists
    const userByEmail = await this.userService.findByEmail(requestBody.email);

    if (userByEmail) {
      throw new BadRequestException('Email already exists');
    }

    //hash password

    const hashedPassword = await bcrypt.hash(requestBody.password, 10);

    requestBody.password = hashedPassword;

    // save to db
    const newUser = await this.userService.createUser(requestBody);
    //generate jwt token

    const confirmationToken = this.jwtService.sign(
      { email: newUser.email },
      { expiresIn: '1h' },
    );
    this.userService.saveConfirmationToken(newUser.id, confirmationToken);
    const confirmationUrl = `${process.env.APP_URL}/auth/confirm?token=${confirmationToken}`;
    await this.mailService.sendConfirmationEmail(
      newUser.email,
      confirmationUrl,
    );
  }

  async confirmEmail(
    token: string,
  ): Promise<{ msg: string; access_token: string }> {
    const decoded = this.jwtService.verify(token);
    const user = await this.userService.findByEmail(decoded.email);
    if (!user || user.isConfirmed) {
      throw new NotFoundException('Invalid or expired confirmation token');
    }

    await this.userService.confirmUser(user.id);
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
    const access_token = await this.generateResetToken(payload);
    return {
      msg: 'User has been created',
      access_token,
    };
  }

  async login(
    requestBody: LoginDto,
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    const userByEmail = await this.userService.findByEmail(requestBody.email);
    if (!userByEmail) {
      return {
        success: false,
      };
    }

    // check password

    const isMathchPassword = await bcrypt.compare(
      requestBody.password,
      userByEmail.password,
    );
    if (!isMathchPassword) {
      return {
        success: false,
      };
    }
    const payload = {
      id: userByEmail.id,
      firstName: userByEmail.firstName,
      lastName: userByEmail.lastName,
      email: userByEmail.email,
      role: userByEmail.role,
    };
    const access_token = this.generateResetToken(payload);
    return {
      success: true,
      data: {
        access_token,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Email not found!');
    }

    const resetToken = await this.generateResetToken({ reset: true });

    await this.userService.saveResetToken(user.id, resetToken);

    const resetPasswordUrl = `http://frontend-url/reset-password?token=${resetToken}`;
    await this.mailService.sendForgotPasswordEmail(
      user.email,
      resetPasswordUrl,
    );
    return { message: 'Reset password link sent to email' };
  }

  async generateResetToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: `${process.env.JWT_SECRET}`,
    });
  }
}
