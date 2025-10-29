import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserDTO } from './user.dto';

export class LoginDTO extends UserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
