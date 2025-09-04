import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    refreshToken?: string;
    createdAt: number | Date;
  }
}
