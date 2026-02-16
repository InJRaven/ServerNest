import { BaseException } from '@base';

export class UnsupportedImportFileException extends BaseException {
  constructor(ext: string) {
    super('IMPORT_UNSUPPORTED_FILE', `Unsupported file type: ${ext}`);
  }
}
