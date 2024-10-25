import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('api/v1/users')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get('confirm')
  async confirm(@Query('token') token: string): Promise<string> {
    const user = await this.authService.confirmEmail(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired confirmation token. ');
    }
    return 'Account confirmed successfully!';
  }

  @Post('refresh-token')
  async refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
    try {
      const payload = this.jwtService.verifyAsync(refreshToken);
      const newAccessToken = this.authService.generateResetToken(
        payload,
        '15m',
      );
      return { access_token: newAccessToken };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
