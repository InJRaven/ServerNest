import { AuthController } from '@modules/server/controllers/auth.controller';
import { PageController } from '@modules/server/controllers/page.controller';

export const ServerController = [AuthController, PageController];

export { AuthController, PageController };
