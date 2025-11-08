import { IsOptional, IsString } from 'class-validator';

class GenresDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export { GenresDTO };
