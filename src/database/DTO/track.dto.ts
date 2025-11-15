import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsObject,
  IsEnum,
  IsUrl,
  Min,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

class TrackDTO {
  @IsString()
  @IsNotEmpty()
  album_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsNumber()
  @Min(0)
  duration: number; // in seconds

  @IsNumber()
  @Min(1)
  track_no: number;

  @IsUrl()
  file_url: string;

  @IsOptional()
  @IsUrl()
  cover_url?: string;

  @IsOptional()
  @IsString()
  lyrics: string;

  @IsOptional()
  @IsBoolean()
  is_explicit?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bpm?: number;

  @IsOptional()
  @IsDateString()
  release_date?: string;

  @IsOptional()
  @IsObject()
  external_urls?: {
    youtube?: string;
    soundcloud?: string;
    apple_music?: string;
    tiktok?: string;
  };

  @IsOptional()
  @IsEnum(['public', 'private', 'unlisted'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;
}

export { TrackDTO };
