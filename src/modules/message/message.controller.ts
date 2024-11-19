import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { SendMessageDto } from './dto/sendMessage.dto';

@Controller('api/v1/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.messageService.sendMessage(
      sendMessageDto.chatId,
      sendMessageDto.senderId,
      sendMessageDto.content,
    );
  }

  @Get(':chatId')
  async getMessagesForChat(@Param('chatId') chatId: number) {
    return this.messageService.getMessagesForChat(chatId);
  }
}
