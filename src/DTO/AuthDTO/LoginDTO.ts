import { UserDTO } from '../UserDTO';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDTO extends UserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
