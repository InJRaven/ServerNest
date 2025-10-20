import { LoginDTO } from './login.dto';
import { RegisterDTO } from './register.dto';
import { UserDTO } from './user.dto';
import { VerifyEmailDTO, ResendOTPDTO } from './email.dto';

export { LoginDTO, RegisterDTO, UserDTO, VerifyEmailDTO, ResendOTPDTO };
export const modelDTO = [
  LoginDTO,
  RegisterDTO,
  UserDTO,
  VerifyEmailDTO,
  ResendOTPDTO,
];
