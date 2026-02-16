import { BaseException } from '@base';

export class InvalidFileExtensionException extends BaseException {
  constructor(ext: string) {
    super('UPLOAD_INVALID_EXTENSION', `Invalid file extension: ${ext}`);
  }
}
