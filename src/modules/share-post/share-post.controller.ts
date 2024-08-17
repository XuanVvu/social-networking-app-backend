import { SharePostService } from '@/modules/share-post/share-post.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';

@Controller('share-post')
export class SharePostController {
  constructor(private sharePostService: SharePostService) {}

  @Post(':postId')
  sharePost(
    @Param('postId') postId: number,
    @Req() req,
    @Body('caption') caption?: string,
  ) {
    return this.sharePostService.sharePost(postId, req.user.id, caption);
  }

  @Get('user')
  getSharedPosts(@Req() req) {
    return this.sharePostService.getSharedPosts(req.user.id);
  }

  @Get('post/:postId')
  getPostShares(@Param('postId') postId: number) {
    return this.sharePostService.getPostShares(postId);
  }

  @Delete(':sharedPostId')
  deleteSharedPost(@Param('sharedPostId') sharedPostId: number, @Req() req) {
    return this.sharePostService.deleteSharedPost(sharedPostId, req.user.id);
  }
}
