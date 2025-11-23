import { ConflictException } from '@nestjs/common';

export class EntityAlreadyExistsException extends ConflictException {
  constructor(entityName: string, field: string, value: any) {
    const message = `${entityName} with ${field} "${value}" already exists`;
    super(message);

    // Set error name
    this.name = 'EntityAlreadyExistsException';
  }
}
