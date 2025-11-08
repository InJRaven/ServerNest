import { Provider } from '@nestjs/common';
import { AdminAuthService } from './admin_auth.service';
import { PageService } from './page.service';
import { TokenService } from '@shared';
import { GenresService } from '@modules/server/services/genres.service';

export const AdminServiceProvider: Provider[] = [
  AdminAuthService,
  PageService,
  TokenService,
  GenresService,
];
export { AdminAuthService, PageService, GenresService };
