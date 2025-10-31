import { Provider } from '@nestjs/common';
import { UserRepository } from './client/user.repository';
import { AdminRepository } from './admin.repository';
export { AdminRepository, UserRepository };
export const modelRepository: Provider[] = [AdminRepository, UserRepository];
