import { IsString, IsOptional, IsDateString, IsUrl } from 'class-validator';

class ArtistsDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDateString()
  debut_date?: Date;

  @IsOptional()
  @IsUrl()
  avatar_url?: string;
}
export { ArtistsDTO };
