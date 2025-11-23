import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string, identifier: string | number) {
    const message = `${entityName} with identifier "${identifier}" not found`;
    super(message);
    this.name = 'EntityNotFoundException';
  }
}
