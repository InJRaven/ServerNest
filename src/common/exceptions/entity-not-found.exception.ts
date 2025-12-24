import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  public readonly code?: string;

  constructor(entityName: string, identifier: string | number, code?: string) {
    const message = `${entityName} with identifier "${identifier}" not found`;
    super({ code, message });
    this.code = code;
    this.name = 'EntityNotFoundException';
  }
}
