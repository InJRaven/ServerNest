import { Provider } from '@nestjs/common';
import { GenresService } from './genres.service';
import { ArtistsServices } from './artists.service';
import { ArtistRolesService } from './artist_roles.service';
export const CoreServices: Provider[] = [
  GenresService,
  ArtistsServices,
  ArtistRolesService,
];
export { GenresService, ArtistsServices, ArtistRolesService };
