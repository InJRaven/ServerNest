import { Provider } from '@nestjs/common';
import { UserRepository } from './user.repository';

export { UserRepository };
export const modelRepository: Provider[] = [UserRepository];
