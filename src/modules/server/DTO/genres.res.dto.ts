import { IsOptional, IsString } from 'class-validator';

class GenresResDTO {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  createdAt?: Date;
  @IsOptional()
  updatedAt?: Date;
}

export { GenresResDTO };
