import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getHello(user: unknown) {
    return { message: 'Hello World!', user };
  }
}
