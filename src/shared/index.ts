import { Provider } from '@nestjs/common';
import { TokenService } from './tokenService';
import { EntityVerifier } from './entityVerifier';
import { defaultGenres, defaultAdminRoles } from './default-data';

export const SharedProvider: Provider[] = [TokenService, EntityVerifier];

export { TokenService, EntityVerifier, defaultGenres, defaultAdminRoles };
