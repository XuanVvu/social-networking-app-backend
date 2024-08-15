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
    console.log(currentUser);
    // console.log(req);

    return this.friendService.sendFriendRequest(currentUser.id, recipientId);
  }

  @Post('accept/:friendRequestId')
  acceptFriendRequest(@Param('friendRequestId') friendRequestId: number) {
    return this.friendService.acceptFriendRequest(friendRequestId);
  }

  @Post('reject/:friendRequestId')
  rejectFriendRequest(@Param('friendRequestId') friendRequestId: number) {
    return this.friendService.rejectFriendRequest(friendRequestId);
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
  cancelFriendRequest(@Req() req, @Param('recipientId') recipientId: number) {
    return this.friendService.cancelFriendRequest(req.user.id, recipientId);
  }

  @Delete(':friendId')
  removeFriend(@Req() req, @Param('friendId') friendId: number) {
    return this.friendService.removeFriend(req.user.id, friendId);
  }
}
