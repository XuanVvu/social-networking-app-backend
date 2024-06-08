import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '@/shared/helpers/checkPermission.helper';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/registerUser.dto';
// import { RegisterUserDto } from './dto/registerUser.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(requestBody: RegisterUserDto) {
    const user = await this.userRepository.create(requestBody);
    return this.userRepository.save(user);
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async updateUser(id: number, user: User, currentUser: User) {
    if (user.role) {
      throw new BadRequestException('You cannot change role');
    }
    const userUpdate = await this.findUserById(id);
    if (!userUpdate) {
      throw new HttpException('User does not exist', 404);
    }

    Permission.check(id, currentUser);

    return await this.userRepository.update(id, user);
  }

  async deleteUser(id: number) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new HttpException('User does not exist', 404);
    }

    return this.userRepository.remove(user);
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  updateAvatar(currentUser: User, avatar: string) {
    return this.userRepository.update(currentUser.id, { avatar });
  }
}
