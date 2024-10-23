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
import { User } from './user.entity';

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
    const savedUser = await this.userService.create(requestBody);
    //generate jwt token

    const confirmationToken = this.jwtService.sign(
      {
        email: savedUser.email,
      },
      { expiresIn: '1h' },
    );
    const payload = {
      id: savedUser.id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      role: savedUser.role,
    };
    const access_token = this.generateResetToken(payload);
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

  async confirmEmail(token: string): Promise<User> {
    const user = await this.userService.findByConfirmationToken(token);
    if (!user) {
      throw new NotFoundException('User not found. ');
    }

    user.isConfirmed = true;
    user.confirmationToken = null;
    await this.userService.update(user);
    return user;
  }
}
