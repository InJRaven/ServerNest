import { IsUUID, IsEnum, IsOptional, IsString } from 'class-validator';

export enum ArtistRole {
  MAIN = 'main',
  FEATURED = 'featured',
  COMPOSER = 'composer',
  PRODUCER = 'producer',
}
class SongArtistsDTO {
  @IsUUID()
  song_id: string;

  @IsUUID()
  artist_id: string;

  @IsOptional()
  @IsEnum(ArtistRole)
  @IsString()
  role?: ArtistRole;
}

export { SongArtistsDTO };
