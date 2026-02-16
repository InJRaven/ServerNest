import { BaseException } from '@base';
import { HttpStatus } from '@nestjs/common';

export class FileTooLargeException extends BaseException {
  constructor(limit: number) {
    super(
      'UPLOAD_FILE_TOO_LARGE',
      `File exceeds size limit (${limit} bytes)`,
      HttpStatus.PAYLOAD_TOO_LARGE,
    );
  }
}
