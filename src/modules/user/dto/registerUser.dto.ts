import { IsEmail, IsNotEmpty } from 'class-validator';
import { BaseDto } from '@/common/base.dto';

export class RegisterUserDto extends BaseDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  password: string;
}
