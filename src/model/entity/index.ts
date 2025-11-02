import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './admin.enity';
import {
  UserEntity,
  GenresEntity,
  ArtistsEntity,
  AlbumsEntity,
  SongEntity,
  SongGenresEntity,
  SongArtistsEntity,
} from './app';

type EntitiesArg = Parameters<typeof TypeOrmModule.forFeature>[0];

export {
  AdminEntity,
  UserEntity,
  GenresEntity,
  ArtistsEntity,
  AlbumsEntity,
  SongEntity,
  SongGenresEntity,
  SongArtistsEntity,
};

export const Entities: EntitiesArg = [
  AdminEntity,
  UserEntity,
  UserEntity,
  GenresEntity,
  ArtistsEntity,
  AlbumsEntity,
  SongEntity,
  SongGenresEntity,
  SongArtistsEntity,
];
