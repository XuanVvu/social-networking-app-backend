import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', // Port frontend
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly messageService: MessageService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { chatId: number; senderId: number; content: string },
  ) {
    try {
      const message = await this.messageService.sendMessage(
        payload.chatId,
        payload.senderId,
        payload.content,
      );

      // Emit the message to all clients in the room
      this.server.to(`chat_${payload.chatId}`).emit('receiveMessage', message);
    } catch (error) {
      console.error('Error sending message:', error);
      // Có thể gửi phản hồi lỗi tới client nếu cần
    }
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: number,
  ) {
    client.join(`chat_${chatId}`);
    console.log(`Client ${client.id} joined chat ${chatId}`);
  }
}
