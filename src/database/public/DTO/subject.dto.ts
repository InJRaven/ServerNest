import { IsArray, IsOptional, IsString } from 'class-validator';

export class SubjectDTO {
  @IsString()
  identify: string;

  @IsString()
  shortName: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  urlSubject?: string[];
}
