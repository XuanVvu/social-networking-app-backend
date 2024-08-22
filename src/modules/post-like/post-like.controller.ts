import { PostLikeService } from '@/modules/post-like/post-like.service';
import { User } from '@/modules/user/user.entity';
import { CurrentUser } from '@/shared/decorator/currentUser.decorator';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

@Controller('api/v1/post-like')
export class PostLikeController {
  constructor(private postlikeService: PostLikeService) {}

  @Get('/:postId/like-status')
  @UseGuards(AuthGuard)
  async getLikeStatus(
    @Param('postId') postId: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.postlikeService.getLikeStatus(postId, currentUser);
  }

  @Get('/liked-posts')
  @UseGuards(AuthGuard)
  async getLikedPosts(@CurrentUser() currentUser: User) {
    return this.postlikeService.getLikedPosts(currentUser);
  }

  @Post('/:postId/like')
  @UseGuards(AuthGuard)
  async updateLikeStatus(
    @Param('postId') postId: number,
    @CurrentUser() currentUser: User,
    @Body() body: { liked: boolean },
  ) {
    const { liked } = body;
    await this.postlikeService.updateLikeStatus(postId, currentUser, liked);
  }

  @Get('/:postId/users')
  getLikesByPost(@Param('postId') postId: number) {
    return this.postlikeService.getLikesByPost(postId);
  }

  @Get('/:postId/count')
  getLikeCount(@Param('postId') postId: number) {
    return this.postlikeService.getLikeCount(postId);
  }
}
