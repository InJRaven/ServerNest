import { Provider } from '@nestjs/common';
import { AdminRoleService } from './admin_role.service';
import { AdminService } from './admin.service';
import { PageService } from './page.service';
import { AuthenticationService } from './authentication.service';

export const AdminServiceProvider: Provider[] = [
  AdminRoleService,
  AuthenticationService,
  AdminService,
  PageService,
];
export { AdminRoleService, PageService, AdminService, AuthenticationService };
