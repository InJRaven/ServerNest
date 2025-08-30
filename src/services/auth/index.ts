import { Provider } from '@nestjs/common';
import { AuthService } from './auth.service';

export const AuthServices: Provider[] = [AuthService];

export { AuthService };
