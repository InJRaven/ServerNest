import { AdminRepository } from './admin.repository';
import { UserRepository } from './user.repository';
import { GenresRepository } from './genres.repository';
import { ArtistsRepository } from './artists.repository';
import { AlbumsRepository } from './albums.repository';
import { TrackRepository } from './track.repository';
import { TrackGenresRepository } from './track-genres.repository';
import { TrackArtistsRepository } from './track-artists.repository';
import { Provider } from '@nestjs/common';

export {
  AdminRepository,
  UserRepository,
  GenresRepository,
  ArtistsRepository,
  AlbumsRepository,
  TrackRepository,
  TrackGenresRepository,
  TrackArtistsRepository,
};
export const AdminRepositoryProvider: Provider[] = [AdminRepository];
export const GlobalRepositoriesProvider: Provider[] = [
  UserRepository,
  GenresRepository,
  ArtistsRepository,
  AlbumsRepository,
  TrackRepository,
  TrackGenresRepository,
  TrackArtistsRepository,
];
