import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthorizationGuard } from './authorization.guard';
import { Provider } from '@nestjs/common';

export const Guards: Provider[] = [JwtAuthGuard, AuthorizationGuard];
export { JwtAuthGuard, AuthorizationGuard };
