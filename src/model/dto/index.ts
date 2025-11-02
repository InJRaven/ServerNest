import {
  LoginDTO,
  RegisterDTO,
  VerifyEmailDTO,
  ResendOTPDTO,
} from './auth.dto';
import { AdminDTO, AdminLoginDTO, RegisterAdminDTO } from './admin';
import {
  UserDTO,
  GenresDTO,
  ArtistsDTO,
  AlbumsDTO,
  SongDTO,
  SongGenresDTO,
  SongArtistsDTO,
} from './app';

export {
  //Admin
  AdminDTO,
  AdminLoginDTO,
  RegisterAdminDTO,
  //App
  LoginDTO,
  RegisterDTO,
  VerifyEmailDTO,
  ResendOTPDTO,
  UserDTO,
  GenresDTO,
  ArtistsDTO,
  AlbumsDTO,
  SongDTO,
  SongGenresDTO,
  SongArtistsDTO,
};
export const modelDTO = [
  AdminDTO,
  AdminLoginDTO,
  RegisterAdminDTO,

  LoginDTO,
  RegisterDTO,
  VerifyEmailDTO,
  ResendOTPDTO,

  UserDTO,
  GenresDTO,
  ArtistsDTO,
  AlbumsDTO,
  SongDTO,
  SongGenresDTO,
  SongArtistsDTO,
];
