import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/registerUser.dto';
import { User } from './user.entity';
import { UpdateUserDto } from '@/modules/user/dto/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from '@/modules/user/dto/ChangePassword.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(requestBody: RegisterUserDto) {
    return await this.userRepository.create(requestBody);
  }

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

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser: User,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.id !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have permission to update this user',
      );
    }

    Object.assign(user, updateUserDto);

    if (updateUserDto.avatar && updateUserDto.avatar.length > 0) {
      user.avatar = updateUserDto.avatar[0].filename;
    } else {
      user.avatar = currentUser.avatar;
    }

    return await this.userRepository.save(user);
  }

  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
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

  async saveResetToken(userId: number, resetToken: string): Promise<void> {
    await this.userRepository.update(userId, {
      resetToken: resetToken,
      resetTokenExpires: new Date(Date.now() + 3600000),
    });
  }

  async changePassword(
    user: User,
    changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    const { oldPassword, newPassword } = changePasswordDto;
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return { message: 'Mật khẩu không chính xác', status: false };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await this.userRepository.save({ ...user, password: hashedPassword });

    return { message: 'Mật khẩu đã được thay đổi thành công', status: true };
  }

  async saveConfirmationToken(userId: number, token: string) {
    await this.userRepository.update(userId, {
      confirmationToken: token,
    });
  }

  async findByConfirmationToken(token: string): Promise<User> {
    return this.userRepository.findOne({ where: { confirmationToken: token } });
  }
}
