import { Provider } from '@nestjs/common';
import { AppService } from './app.service';

export const AppServices: Provider[] = [AppService];
export { AppService };
