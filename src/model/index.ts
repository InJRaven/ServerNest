import { Provider } from '@nestjs/common';
import { UserModel } from './user.model';

export { UserModel };
export const model: Provider[] = [UserModel];
