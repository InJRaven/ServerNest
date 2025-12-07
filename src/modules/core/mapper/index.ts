import { GenreMapper } from './genre.mapper';
import { ArtistMapper } from './artist.mapper';
import { TrackMapper } from './track.mapper';
import { AlbumMapper } from './album.mapper';

export { GenreMapper, ArtistMapper, TrackMapper, AlbumMapper };

export const CoreMapper = [GenreMapper, ArtistMapper, TrackMapper];
