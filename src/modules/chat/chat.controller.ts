import { CreateChatDto } from '@/modules/chat/dto/createChat.dto';
import { User } from '@/modules/user/user.entity';
import { CurrentUser } from '@/shared/decorator/currentUser.decorator';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('api/v1/chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(
      createChatDto.userId1,
      createChatDto.userId2,
    );
  }

  @Get('/:userId')
  async getChatsForUser(@Param('userId') userId: number) {
    return this.chatService.getChatsForUser(userId);
  }

  @Get('/:userId/messages')
  @UseGuards(AuthGuard)
  async getChatForCurrentAndOtherUser(
    @CurrentUser() currentUser: User,
    @Param('userId') userId: number,
  ) {
    return this.chatService.getChatForCurrentAndOtherUser(
      userId,
      currentUser.id,
    );
  }
}
