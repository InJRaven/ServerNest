import { IsEmail, MaxLength } from 'class-validator';
import { UserDTO } from './user.dto';
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
