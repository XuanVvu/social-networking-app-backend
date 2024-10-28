import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;
  private activeUsers = new Map<number, string>();

  constructor(private notificationService: NotificationService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.set(Number(userId), client.id);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.activeUsers.entries()) {
      if (socketId === client.id) {
        this.activeUsers.delete(userId);
        break;
      }
    }
  }

  notifyUser(userId: number, message: string) {
    const socketId = this.activeUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('newNotification', message);
    }
  }

  @SubscribeMessage('getNotifications')
  async handleGetNotifications(client: Socket) {
    const userId = Number(client.handshake.query);
    const notifications =
      await this.notificationService.getUserNotifications(userId);
    client.emit('allNotifications', notifications);
  }
}
