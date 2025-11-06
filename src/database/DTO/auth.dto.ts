import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { UserDTO } from './user.dto';

class AdminLoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

class RegisterAdminDTO {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

class RegisterDTO extends UserDTO {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

class LoginDTO extends UserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

class VerifyEmailDTO extends UserDTO {
  @IsEmail()
  email: string;
  @MaxLength(6)
  otp: string;
}
class ResendOTPDTO extends UserDTO {
  @IsEmail()
  email: string;
}
export {
  AdminLoginDTO,
  RegisterAdminDTO,
  RegisterDTO,
  LoginDTO,
  VerifyEmailDTO,
  ResendOTPDTO,
};
