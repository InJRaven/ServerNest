import { IsEnum, IsOptional, IsString } from 'class-validator';

class TrackArtistsDTO {
  @IsString()
  track_id: string;

  @IsString()
  artist_id: string;

  @IsOptional()
  @IsEnum(['main', 'featured', 'composer', 'producer'])
  role?: 'main' | 'featured' | 'composer' | 'producer';
}

export { TrackArtistsDTO };
