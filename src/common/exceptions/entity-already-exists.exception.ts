import { ConflictException } from '@nestjs/common';

export class EntityAlreadyExistsException extends ConflictException {
  constructor(entityName: string, field: string, value: string) {
    super(`${entityName} with ${field} "${value}" already exists`);
  }
}
