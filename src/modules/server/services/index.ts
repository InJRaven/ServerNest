import { Provider } from '@nestjs/common';
import { AdminAuthService } from './admin_auth.service';
import { PageService } from './page.service';
import { TokenService } from '@shared';

export const AdminServiceProvider: Provider[] = [
  AdminAuthService,
  PageService,
  TokenService,
];
export { AdminAuthService, PageService };
