import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UserService, AuthService, JwtService],
  controllers: [UserController],
  exports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
