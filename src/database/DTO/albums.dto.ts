import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsObject,
  IsEnum,
  IsUrl,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

class AlbumsDTO {
  @IsString()
  @IsNotEmpty()
  artist_id: string;

  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsUrl()
  cover_url: string;

  @IsOptional()
  @IsUrl()
  cover_high_res_url?: string;

  @IsOptional()
  @IsDateString()
  release_date: string;

  @IsOptional()
  @IsBoolean()
  is_explicit?: boolean;

  @IsEnum(['album', 'single', 'ep', 'compilation'])
  album_type: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @IsOptional()
  @IsObject()
  external_urls?: {
    youtube?: string;
    spotify?: string;
    apple_music?: string;
    soundcloud?: string;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  credits?: Array<{
    role: string;
    name: string;
  }>;

  @IsOptional()
  @IsEnum(['public', 'private', 'unlisted'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;
}
export { AlbumsDTO };
