import { BaseDto } from '@/common/base.dto';

export class UpdatePostDto extends BaseDto {
  content?: string;
  photosToAdd?: Express.Multer.File[];
  photoIdsToDelete?: number[];
}
