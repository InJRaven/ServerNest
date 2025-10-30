import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { ArtistsEnity } from './artists.enity';
import { GenresEnity } from './genres.enity';
import { AlbumsEnity } from './albums.enity';
import { SongEnity } from './song.enity';
import { SongGenresEnity } from './songGenres.enity';
import { SongArtistsEnity } from './songArtists.enity';
type EntitiesArg = Parameters<typeof TypeOrmModule.forFeature>[0];

export {
  UserEntity,
  ArtistsEnity,
  GenresEnity,
  AlbumsEnity,
  SongEnity,
  SongGenresEnity,
  SongArtistsEnity,
};

export const Entities: EntitiesArg = [
  UserEntity,
  ArtistsEnity,
  GenresEnity,
  AlbumsEnity,
  SongEnity,
  SongGenresEnity,
  SongArtistsEnity,
];
