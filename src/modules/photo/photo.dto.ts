import { IsNotEmpty, MinLength } from 'class-validator';
import { BaseDto } from '@/common/base.dto';

export class PhotoDto extends BaseDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @MinLength(8, {
    message: '8 characters minimum',
  })
  description: string;
  @IsNotEmpty()
  filename: string;
  @IsNotEmpty()
  views: number;
  @IsNotEmpty()
  isPublished: boolean;
}
