import {
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsUrl,
  IsUUID,
} from 'class-validator';

class AlbumsDTO {
  @IsUUID()
  artist_id: string;

  @IsString()
  title: string;

  @IsDateString()
  release_date: Date;

  @IsUrl()
  cover_url: string;

  @IsOptional()
  @IsBoolean()
  is_explicit?: boolean;
}
export { AlbumsDTO };
