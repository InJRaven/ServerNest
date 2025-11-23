import { BadRequestException } from '@nestjs/common';

export class InvalidOperationException extends BadRequestException {
  constructor(message: string, context?: string) {
    super(`[${context}] ${message}`);
    this.name = 'InvalidOperationException';
  }
}
