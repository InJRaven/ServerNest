import { Provider } from '@nestjs/common';
import { GenresService } from './genres.service';

export const CoreServiceProvier: Provider[] = [GenresService];
export { GenresService };
