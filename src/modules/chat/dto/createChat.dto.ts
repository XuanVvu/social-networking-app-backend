import { IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  userId1: number;

  @IsNumber()
  userId2: number;
}
