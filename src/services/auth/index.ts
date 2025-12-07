import { Provider } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { EmailService } from './email.service';

export const AuthServices: Provider[] = [
  // AuthService,
  TokenService,
  EmailService,
];

export { TokenService, EmailService };
