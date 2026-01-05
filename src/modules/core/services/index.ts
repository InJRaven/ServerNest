import { Provider } from '@nestjs/common';
import { GenresService } from './genres.service';
import { ArtistsServices } from './artists.service';
export const CoreServices: Provider[] = [GenresService, ArtistsServices];
export { GenresService, ArtistsServices };
