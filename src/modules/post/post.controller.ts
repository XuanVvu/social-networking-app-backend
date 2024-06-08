import { AuthGuard } from '@/shared/guards/auth.guard';
import { PostService } from './post.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreatePostDto } from '@/modules/post/dto/createPostDto';
import { CurrentUser } from '@/shared/decorator/currentUser.decorator';
import { User } from '@/modules/user/user.entity';

@Controller('api/v1/create-post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.postService.createPost(createPostDto, currentUser);
  }
}
