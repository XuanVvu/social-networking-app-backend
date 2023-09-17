import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/user.dto';
// import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  createUser(user: any): any {
    user.createdAt = new Date();
    user.id = '1';
    user.updatedAt = new Date();
    user.deletedAt = new Date();
    return UserDto.plainToClass(user);
  }
}
