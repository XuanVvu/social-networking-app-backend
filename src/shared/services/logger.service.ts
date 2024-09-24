import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private static instance: LoggerService;

  // Private constructor to prevent direct class instantiation
  constructor() {}

  // Static method to return the singleton instance
  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }

    return LoggerService.instance;
  }

  public log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}
