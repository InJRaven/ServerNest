import { Provider } from '@nestjs/common';
import { TokenService } from '@shared';
import { AdminRoleService } from './admin_role.service';
import { AdminService } from './admin.service';
import { PageService } from './page.service';
import { AuthenticationService } from './authentication.service';

export const AdminServiceProvider: Provider[] = [
  AdminRoleService,
  AuthenticationService,
  AdminService,
  PageService,
  TokenService,
];
export { AdminRoleService, PageService, AdminService, AuthenticationService };
