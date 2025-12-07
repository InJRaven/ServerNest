import { AuthController } from '@modules/server/controllers/auth.controller';
import { PageController } from '@modules/server/controllers/page.controller';
import { GenresController } from './genres.controller';

export const ServerController = [
  AuthController,
  PageController,
  GenresController,
];

export { AuthController, PageController, GenresController };
