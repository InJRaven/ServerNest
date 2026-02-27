import { Provider } from '@nestjs/common';
import { TokenService } from './tokenService';
import {
  defaultGenres,
  defaultAdminRoles,
  defaultArtsitRoles,
  defaultSubjects,
} from './default-data';

export const SharedProvider: Provider[] = [TokenService];

export {
  TokenService,
  defaultGenres,
  defaultAdminRoles,
  defaultArtsitRoles,
  defaultSubjects,
};
