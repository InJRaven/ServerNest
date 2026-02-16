import { BaseException } from '@base';

export class InvalidMimeTypeException extends BaseException {
  constructor(mime: string) {
    super('UPLOAD_INVALID_MIME', `Invalid mime type: ${mime}`);
  }
}
