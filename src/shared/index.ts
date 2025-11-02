import { Provider } from '@nestjs/common';
import { TokenService } from './tokenService';
import { EntityVerifier } from './entityVerifier';

export const SharedProvider: Provider[] = [TokenService, EntityVerifier];

export { TokenService, EntityVerifier };
