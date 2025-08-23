import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserDTO } from './';

export class RegisterDTO extends UserDTO {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
