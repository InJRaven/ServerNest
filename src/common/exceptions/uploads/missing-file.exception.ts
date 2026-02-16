import { BaseException } from '@base';

export class MissingFileException extends BaseException {
  constructor() {
    super('UPLOAD_FILE_MISSING', 'No file provided');
  }
}
