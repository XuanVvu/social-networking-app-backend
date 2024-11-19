import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  WebSocketServer,
  MessageBody as WsMessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(private notificationService: NotificationService) {}

  @SubscribeMessage('joinNotificationRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    client.join(`notification_${userId}`);
  }

  @SubscribeMessage('getUnreadNotifications')
  async handleGetUnreadNotifications(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    return this.notificationService.getUnreadNotifications(userId);
  }

  @SubscribeMessage('markNotificationAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @WsMessageBody() notificationId: number,
  ) {
    await this.notificationService.markAsRead(notificationId);
    return { status: 'marked as read' };
  }

  // Phương thức này sẽ được gọi từ các service khác khi cần gửi thông báo
  async sendNotification(
    userId: number,
    type: string,
    content: string,
    relatedItemId?: number,
  ) {
    const notification = await this.notificationService.createNotification(
      userId,
      type,
      content,
      relatedItemId,
    );
    this.server
      .to(`notification_${userId}`)
      .emit('newNotification', notification);
  }
}
function MessageBody() {
  throw new Error('Function not implemented.');
}
