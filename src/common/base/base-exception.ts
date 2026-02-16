import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    code: string,
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    meta?: any,
  ) {
    super(
      {
        code,
        message,
        meta,
      },
      status,
    );
  }
}
