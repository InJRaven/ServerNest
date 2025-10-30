import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { UserDTO } from './user.dto';
export class RegisterDTO extends UserDTO {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDTO extends UserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class VerifyEmailDTO extends UserDTO {
  @IsEmail()
  email: string;
  @MaxLength(6)
  otp: string;
}
export class ResendOTPDTO extends UserDTO {
  @IsEmail()
  email: string;
}
