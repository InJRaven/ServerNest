import { AdminEntity } from './admin.enity';
import { UserEntity } from './user.entity';
import { GenresEntity } from './genres.entity';
import { ArtistsEntity } from './artists.entity';
import { AlbumsEntity } from './albums.entity';
import { SongEntity } from './song.entity';
import { SongGenresEntity } from './songGenres.entity';
import { SongArtistsEntity } from './songArtists.entity';

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
export const AdminEntitires = [AdminEntity];
export const GlobalEntities = [
  UserEntity,
  GenresEntity,
  ArtistsEntity,
  AlbumsEntity,
  SongEntity,
  SongGenresEntity,
  SongArtistsEntity,
];
