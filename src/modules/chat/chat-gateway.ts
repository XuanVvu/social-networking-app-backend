import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { to: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.saveMessage(
      client.data.userId,
      data.to,
      data.content,
    );
    this.server.to(data.to.toString()).emit('receiveMessage', message);
    return { status: 'sent', messageId: message.id };
  }

  @SubscribeMessage('getUnreadMessages')
  async handleGetUnreadMessages(@ConnectedSocket() client: Socket) {
    return this.chatService.getUnreadMessages(client.data.userId);
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(@MessageBody() messageId: number) {
    await this.chatService.markMessageAsRead(messageId);
    return { status: 'marked as read' };
  }

  @SubscribeMessage('getConversation')
  async handleGetConversation(
    @MessageBody() otherUserId: number,
    @ConnectedSocket() client: Socket,
  ) {
    return this.chatService.getConversation(client.data.userId, otherUserId);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket) {
    client.join(client.data.userId.toString());
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
