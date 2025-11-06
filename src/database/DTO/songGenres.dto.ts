import { IsUUID } from 'class-validator';

class SongGenresDTO {
  @IsUUID()
  song_id: string;

  @IsUUID()
  genre_id: string;
}

export { SongGenresDTO };
