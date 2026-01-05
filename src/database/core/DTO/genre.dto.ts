import { IsOptional, IsString } from 'class-validator';

export class GenreDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
