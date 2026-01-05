import { AuthenticationController } from './authentication.controller';
import { PageController } from './page.controller';
import { AdminController } from './admin.controller';
import { GenresController } from './genres.controller';
export const AdminControllers = [
  AdminController,
  AuthenticationController,
  GenresController,
  PageController,
];

export { AdminController, AuthenticationController, PageController };
