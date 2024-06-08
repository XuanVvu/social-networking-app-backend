import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Get token from header

    if (!request.headers.authorization) {
      throw new BadRequestException('Please login');
    }

    const token = request.headers.authorization.split(' ')[1];

    // jwtVerify validates the token

    if (!token) {
      throw new ForbiddenException(' Please provice access token');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: `${process.env.JWT_SECRET}`,
      });

      // Find the user in db based on jwtVerify

      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new BadRequestException(
          'User not belong to token, please try again',
        );
      }

      //Assign the user too request object

      request.currentUser = user;
    } catch (err) {
      throw new ForbiddenException('Invalid token or expired');
    }

    return true;
  }
}
