import { IsNumber, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNumber()
  chatId: number;

  @IsNumber()
  senderId: number;

  @IsString()
  content: string;
}
