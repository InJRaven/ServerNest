import { AuthenticationController } from './authentication.controller';
import { PageController } from './page.controller';
import { AdminController } from './admin.controller';
export const AdminControllers = [
  AdminController,
  AuthenticationController,
  PageController,
];

export { AdminController, AuthenticationController, PageController };
