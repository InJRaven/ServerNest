import { IsOptional, IsString } from 'class-validator';

class GenresDTO {
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export { GenresDTO };
