import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from './common/base.dto';

export class UserDto extends BaseDto {
  @IsNotEmpty()
  @Expose()
  username: string;

  @IsNotEmpty()
  @Expose()
  password: string;
}
