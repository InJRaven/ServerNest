import { UserDTO } from '../UserDTO';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDTO extends UserDTO {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
