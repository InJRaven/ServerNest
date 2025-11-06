import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthorizationGuard } from './authorization.guard';
import { Provider } from '@nestjs/common';

export const GuardsProvider: Provider[] = [JwtAuthGuard, AuthorizationGuard];
export { JwtAuthGuard, AuthorizationGuard };
