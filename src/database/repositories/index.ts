import { AdminRepository } from './admin.repository';
import { UserRepository } from './user.repository';
import { GenresRepository } from './genres.repository';
import { ArtistsRepository } from './artists.repository';
import { AlbumsRepository } from './albums.repository';
import { SongRepository } from './song.repository';
import { SongGenresRepository } from './SongGenres.repository';
import { SongArtistsRepository } from './songArtists.repository';
import { Provider } from '@nestjs/common';

export {
  AdminRepository,
  UserRepository,
  GenresRepository,
  ArtistsRepository,
  AlbumsRepository,
  SongRepository,
  SongGenresRepository,
  SongArtistsRepository,
};
export const AdminRepositoryProvider: Provider[] = [AdminRepository];
export const GlobalRepositoriesProvider: Provider[] = [
  UserRepository,
  GenresRepository,
  ArtistsRepository,
  AlbumsRepository,
  SongRepository,
  SongGenresRepository,
  SongArtistsRepository,
];
