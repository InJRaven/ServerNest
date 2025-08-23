import { Provider } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { SchemaVerifierService } from './schema-verifier.service';

export const services: Provider[] = [
  AppService,
  AuthService,
  SchemaVerifierService,
];

export { AppService, AuthService, SchemaVerifierService };
