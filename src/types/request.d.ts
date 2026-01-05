import 'express';
import type { AppRole } from '@/guard/auth.decorator';
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      username?: string;
      email?: string;
      role: AppRole;
      isSuperAdmin: boolean;
    };
  }
}
