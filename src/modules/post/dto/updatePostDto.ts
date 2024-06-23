export class UpdatePostDto {
  content?: string;
  photosToAdd?: Express.Multer.File[];
  photoIdsToDelete?: number[];
}
