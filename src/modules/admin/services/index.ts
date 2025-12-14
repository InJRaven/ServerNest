import { Provider } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PageService } from './page.service';
import { TokenService } from '@shared';

export const AdminServiceProvider: Provider[] = [
  AdminService,
  PageService,
  TokenService,
];
export { AdminService, PageService };
