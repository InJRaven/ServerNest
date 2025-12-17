import { Provider } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AdminService } from './admin.service';
import { PageService } from './page.service';
import { TokenService } from '@shared';

export const AdminServiceProvider: Provider[] = [
  AuthenticationService,
  AdminService,
  PageService,
  TokenService,
];
export { AuthenticationService, AdminService, PageService };
