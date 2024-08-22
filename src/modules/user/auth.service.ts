import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/LoginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
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
    const savedUser = await this.userService.createUser(requestBody);
    //generate jwt token

    const payload = {
      id: savedUser.id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      role: savedUser.role,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: `${process.env.JWT_SECRET}`,
    });
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
    const access_token = await this.jwtService.signAsync(payload, {
      secret: `${process.env.JWT_SECRET}`,
    });
    return {
      success: true,
      data: {
        access_token,
      },
    };
  }
}
