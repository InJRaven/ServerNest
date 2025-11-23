import { InternalServerErrorException } from '@nestjs/common';

export class InternalServerException extends InternalServerErrorException {
  constructor(message: string, error?: Error, context?: string) {
    let finalMessage = message;
    if (context) {
      finalMessage = `[${context}] ${message}`;
    }
    if (error instanceof Error) {
      finalMessage += ` | ${error.message}`;
    }

    super(finalMessage);

    // Set error name
    this.name = 'InternalServerException';
  }
}
