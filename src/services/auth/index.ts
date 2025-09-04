import { Provider } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

export const AuthServices: Provider[] = [AuthService, TokenService];

export { AuthService, TokenService };
