import { Chat } from '@/modules/chat/chat.entity';
import { CreateChatDto } from '@/modules/chat/dto/createChat.dto';
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
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

  @Get(':userId')
  async getChatsForUser(@Param('userId') userId: number) {
    return this.chatService.getChatsForUser(userId);
  }
}
