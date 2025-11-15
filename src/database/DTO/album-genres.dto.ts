import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';

class AlbumGenresDto {
  @IsString()
  album_id: string;

  @IsString()
  genre_id: string;

  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  weight?: number;
}
export { AlbumGenresDto };
