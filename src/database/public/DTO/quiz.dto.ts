import { IsArray, IsOptional, IsString } from 'class-validator';

export class QuizDTO {
  @IsString()
  question: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  answers: string[];
}
