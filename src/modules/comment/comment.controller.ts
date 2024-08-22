import { CommentService } from '@/modules/comment/comment.service';
import { User } from '@/modules/user/user.entity';
import { CurrentUser } from '@/shared/decorator/currentUser.decorator';
import { AuthGuard } from '@/shared/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

@Controller('api/v1/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('/:postId')
  @UseGuards(AuthGuard)
  createComment(
    @Body('content') content: string,
    @Param('postId') postId: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.commentService.createComment(content, postId, currentUser);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  updateComment(
    @Param('id') id: number,
    @Body('content') content: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.commentService.updateComment(id, content, currentUser.id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  deleteComment(@Param('id') id: number, @CurrentUser() currentUser: User) {
    return this.commentService.deleteComment(id, currentUser);
  }

  @Get('post/:postId')
  getCommentsByPost(@Param('postId') postId: number) {
    return this.commentService.getCommentsByPost(postId);
  }
}
