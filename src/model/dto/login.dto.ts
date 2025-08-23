import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserDTO } from './';

export class LoginDTO extends UserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
