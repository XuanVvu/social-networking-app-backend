import { User } from '@/modules/user/user.entity';
import { CurrentUser } from '@/shared/decorator/currentUser.decorator';
import { AuthGuard } from '@/shared/guards/auth.guard';
import {
  Controller,
  Post,
  Param,
  Get,
  Req,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { FriendService } from './friend.service';

@Controller('api/v1/friends')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Post('request/:recipientId')
  @UseGuards(AuthGuard)
  sendFriendRequest(
    @Req() req,
    @CurrentUser() currentUser: User,
    @Param('recipientId') recipientId: number,
  ) {
    return this.friendService.sendFriendRequest(currentUser.id, recipientId);
  }

  @Post('accept/:friendRequestId')
  @UseGuards(AuthGuard)
  acceptFriendRequest(
    @Param('friendRequestId') friendRequestId: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.friendService.acceptFriendRequest(
      friendRequestId,
      currentUser.id,
    );
  }

  @Delete('reject/:friendRequestId')
  @UseGuards(AuthGuard)
  rejectFriendRequest(
    @Param('friendRequestId') friendRequestId: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.friendService.rejectFriendRequest(
      friendRequestId,
      currentUser.id,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  getFriends(
    @Req() req,
    @CurrentUser() currentUser: User,
    @Query('status') status: 'pending' | 'accepted' | 'sent' = 'accepted',
  ) {
    return this.friendService.getFriendships(currentUser.id, status);
  }

  @Delete('requests/cancel/:recipientId')
  @UseGuards(AuthGuard)
  cancelFriendRequest(
    @Req() req,
    @Param('recipientId') recipientId: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.friendService.cancelFriendRequest(currentUser.id, recipientId);
  }

  @Delete(':friendId')
  @UseGuards(AuthGuard)
  removeFriend(
    @Req() req,
    @Param('friendId') friendId: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.friendService.removeFriend(currentUser.id, friendId);
  }

  @Get('non-friends')
  @UseGuards(AuthGuard)
  async getNonFriends(@Req() req, @CurrentUser() currentUser: User) {
    return this.friendService.getNonFriendsAndPendingRequests(currentUser.id);
  }
}
