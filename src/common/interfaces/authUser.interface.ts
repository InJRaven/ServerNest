import { AppRole } from '@decorators';

export interface AuthUser {
  id: string;
  username?: string;
  email?: string;
  role: AppRole;
  isSuperAdmin: boolean;
}
