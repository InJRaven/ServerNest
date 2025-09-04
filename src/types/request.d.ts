import 'express';
import type { AppRole } from '@/guard/auth.decorator';
declare module 'express-serve-static-core' {
  interface Request {
    auth?: {
      id: string;
      email?: string;
      roles: AppRole;
      isSuperAdmin: boolean;
    };
    user?: {
      id: string;
      username?: string;
      email?: string;
      first_name?: string | null;
      last_name?: string | null;
      full_name?: string | null;
      occupation?: string | null;
      company_name?: string | null;
      phone?: string | null;
      roles: AppRole;
      isSuperAdmin: boolean;
    };
  }
}
