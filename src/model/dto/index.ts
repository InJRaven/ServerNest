import {
  LoginDTO,
  RegisterDTO,
  VerifyEmailDTO,
  ResendOTPDTO,
} from './auth.dto';
import { UserDTO } from './user.dto';

export { LoginDTO, RegisterDTO, UserDTO, VerifyEmailDTO, ResendOTPDTO };
export const modelDTO = [
  LoginDTO,
  RegisterDTO,
  UserDTO,
  VerifyEmailDTO,
  ResendOTPDTO,
];
