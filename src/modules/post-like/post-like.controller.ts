import { PostLikeService } from '@/modules/post-like/post-like.service';
import { User } from '@/modules/user/user.entity';
import { CurrentUser } from '@/shared/decorator/currentUser.decorator';
import { AuthGuard } from '@/shared/guards/auth.guard';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

@Controller('api/v1/post-like')
@Controller('likes')
export class PostLikeController {
  constructor(private postlikeService: PostLikeService) {}

  @Post(':postId')
  @UseGuards(AuthGuard)
  likePost(
    @Param('postId') postId: number,
    @Req() req,
    @CurrentUser() currentUser: User,
  ) {
    return this.postlikeService.likePost(postId, currentUser.id);
  }

  @Delete(':postId')
  @UseGuards(AuthGuard)
  unlikePost(
    @Param('postId') postId: number,
    @Req() req,
    @CurrentUser() currentUser: User,
  ) {
    return this.postlikeService.unlikePost(postId, currentUser.id);
  }

  @Get(':postId/users')
  getLikesByPost(@Param('postId') postId: number) {
    return this.postlikeService.getLikesByPost(postId);
  }

  @Get(':postId/count')
  getLikeCount(@Param('postId') postId: number) {
    return this.postlikeService.getLikeCount(postId);
  }
}
