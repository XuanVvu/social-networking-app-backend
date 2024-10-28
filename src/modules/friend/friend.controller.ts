import { User } from '@/modules/user/user.entity';
import { CurrentUser } from '@/shared/decorator/currentUser.decorator';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { LoggerService } from '@/shared/services/logger.service';
import {
  Controller,
  Post,
  Param,
  Get,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { FriendService } from './friend.service';

@Controller('api/v1/friends')
export class FriendController {
  constructor(
    private friendService: FriendService,
    private logger: LoggerService,
  ) {}

  @Post('request/:recipientId')
  @UseGuards(AuthGuard)
  sendFriendRequest(
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
    @CurrentUser() currentUser: User,
    @Query('status') status: 'pending' | 'accepted' | 'sent' = 'accepted',
  ) {
    return this.friendService.getFriendships(currentUser.id, status);
  }

  @Delete('/cancel/:recipientId')
  @UseGuards(AuthGuard)
  cancelFriendRequest(
    @Param('recipientId') recipientId: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.friendService.cancelFriendRequest(currentUser.id, recipientId);
  }

  @Delete(':friendId')
  @UseGuards(AuthGuard)
  removeFriend(
    @Param('friendId') friendId: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.friendService.removeFriend(currentUser.id, friendId);
  }

  @Get('non-friends')
  @UseGuards(AuthGuard)
  async getNonFriends(@CurrentUser() currentUser: User) {
    return this.friendService.getNonFriendsAndPendingRequests(currentUser.id);
  }

  @Get('status/:userId')
  @UseGuards(AuthGuard)
  async getFriendshipStatus(
    @Param('userId') userId: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.friendService.getFriendshipStatus(currentUser.id, userId);
  }
}
