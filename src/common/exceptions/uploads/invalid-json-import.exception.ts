import { BaseException } from '@base';

export class InvalidJsonImportException extends BaseException {
  constructor() {
    super('IMPORT_INVALID_JSON', 'Invalid JSON import file');
  }
}
