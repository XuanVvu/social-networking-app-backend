export class CreatePostDto {
  content: string;
  photos?: Express.Multer.File[];
}
