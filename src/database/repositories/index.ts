import { BaseRepository } from './base.repository';
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
  BaseRepository,
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
  BaseRepository,
  UserRepository,
  GenresRepository,
  ArtistsRepository,
  AlbumsRepository,
  TrackRepository,
  TrackGenresRepository,
  TrackArtistsRepository,
];
