import { AdminDTO } from './admin.dto';
import {
  AdminLoginDTO,
  RegisterAdminDTO,
  LoginDTO,
  RegisterDTO,
  VerifyEmailDTO,
  ResendOTPDTO,
} from './auth.dto';

import { UserDTO } from './user.dto';
import { GenresDTO } from './genres.dto';
import { ArtistsDTO } from './artists.dto';
import { AlbumsDTO } from './albums.dto';
import { SongDTO } from './song.dto';
import { SongGenresDTO } from './songGenres.dto';
import { SongArtistsDTO } from './songArtists.dto';

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

export const GlobalDTOs = [
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

export const ServerDTO = [AdminDTO, AdminLoginDTO, RegisterAdminDTO];
