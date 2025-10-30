import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUrl,
  IsUUID,
} from 'class-validator';

class SongDTO {
  @IsUUID()
  album_id: string;

  @IsString()
  title: string;

  @IsString()
  duration: string;

  @IsNumber()
  track_no: number;

  @IsUrl()
  file_url: string;

  @IsOptional()
  @IsString()
  lyrics?: string;

  @IsOptional()
  @IsBoolean()
  is_explicit?: boolean;

  @IsOptional()
  @IsNumber()
  bpm?: number;
}

export { SongDTO };
