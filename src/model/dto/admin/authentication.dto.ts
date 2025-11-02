import { IsEmail, IsString, MinLength } from 'class-validator';

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

export { AdminLoginDTO, RegisterAdminDTO };
