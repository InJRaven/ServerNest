import { Provider } from '@nestjs/common';
import { UserRepository } from './app/user.repository';
import { AdminRepository } from './admin.repository';

export { AdminRepository, UserRepository };
export const modelRepositoryProvider: Provider[] = [
  AdminRepository,
  UserRepository,
];
