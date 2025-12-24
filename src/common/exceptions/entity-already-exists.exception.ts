import { ConflictException } from '@nestjs/common';

export class EntityAlreadyExistsException extends ConflictException {
  public readonly code?: string;

  constructor(entityName: string, field: string, value: any, code?: string) {
    const message = `${entityName} with ${field} "${value}" already exists`;
    super({ code, message });

    // Set error name
    this.code = code;
    this.name = 'EntityAlreadyExistsException';
  }
}
