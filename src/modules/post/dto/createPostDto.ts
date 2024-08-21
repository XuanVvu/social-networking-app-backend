import { BaseDto } from '@/common/base.dto';

export class CreatePostDto extends BaseDto {
  content: string;
  photos?: Express.Multer.File[];
}
