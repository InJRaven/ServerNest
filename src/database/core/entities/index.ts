import { Album } from './album.entity';
import { Artist } from './artist.entity';
import { ArtistRole } from './artist_role.entity';
import { Genre } from './genre.entity';
import { Playlist } from './playlist.entity';
import { Track } from './track.entity';
import { User } from './user.entity';

import { AlbumGenre } from './relations/album_genre.entity';
import { AlbumTracks } from './relations/album_tracks.entity';
import { ArtistRoleAssignment } from './relations/artist_role_assignment.entity';
import { ArtistTrack } from './relations/artist_track.entity';
import { PlaylistTrack } from './relations/playlist_track.entity';
import { TrackGenre } from './relations/track_genres.entity';
import { TrackLike } from './relations/track_like.entity';
export const CoreEntities = [
  User,
  Genre,
  Album,
  Artist,
  ArtistRole,
  Track,
  Playlist,

  AlbumGenre,
  AlbumTracks,
  ArtistRoleAssignment,
  ArtistTrack,
  PlaylistTrack,
  TrackGenre,
  TrackLike,
];

export {
  User,
  Genre,
  Album,
  Artist,
  ArtistRole,
  Track,
  Playlist,
  AlbumGenre,
  AlbumTracks,
  ArtistRoleAssignment,
  ArtistTrack,
  PlaylistTrack,
  TrackGenre,
  TrackLike,
};
