import { SavedPostService } from '@/modules/saved-post/saved-post.service';
import { User } from '@/modules/user/user.entity';
import { CurrentUser } from '@/shared/decorator/currentUser.decorator';
import { AuthGuard } from '@/shared/guards/auth.guard';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

@Controller('api/v1/saved-post')
export class SavedPostController {
  constructor(private readonly savedPostService: SavedPostService) {}

  @Post(':postId')
  @UseGuards(AuthGuard)
  savePost(@CurrentUser() currentUser: User, @Param('postId') postId: number) {
    return this.savedPostService.savePost(currentUser, postId);
  }

  @Delete(':postId')
  @UseGuards(AuthGuard)
  removeSavedPost(
    @CurrentUser() currentUser: User,
    @Param('postId') postId: number,
  ) {
    return this.savedPostService.removeSavedPost(currentUser.id, postId);
  }

  @Get()
  @UseGuards(AuthGuard)
  getSavedPosts(@CurrentUser() currentUser: User) {
    return this.savedPostService.getSavedPosts(currentUser.id);
  }
}
