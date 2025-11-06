import { Injectable } from '@nestjs/common';
@Injectable()
export class PageService {
  getHello(admin: any) {
    return { message: 'Admin Page', admin };
  }
}
