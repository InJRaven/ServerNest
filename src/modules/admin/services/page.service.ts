import { Injectable } from '@nestjs/common';
@Injectable()
class PageService {
  getHello(admin: any) {
    return { message: 'Admin Page', admin };
  }
}
export { PageService };
