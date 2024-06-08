import { IsEmail, IsNotEmpty } from 'class-validator';
import { BaseDto } from '@/common/base.dto';

export class LoginDto extends BaseDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
