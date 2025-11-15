import { IsString } from 'class-validator';
class TrackGenresDTO {
  @IsString()
  track_id: string;

  @IsString()
  genre_id: string;
}

export { TrackGenresDTO };
