import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/v1/users')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('confirm')
  async confirm(@Query('token') token: string): Promise<string> {
    const user = await this.authService.confirmEmail(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired confirmation token. ');
    }
    return 'Account confirmed successfully!';
  }
}
