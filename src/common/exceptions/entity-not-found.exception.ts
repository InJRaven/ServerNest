import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string, identifier: string | number) {
    super(`${entityName} with identifier "${identifier}" not found`);
  }
}
