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
import { TrackDTO } from './track.dto';
import { TrackGenresDTO } from './track-genres.dto';
import { TrackArtistsDTO } from './track-artists.dto';
import { AlbumGenresDto } from './album-genres.dto';
export {
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
  TrackDTO,
  TrackGenresDTO,
  TrackArtistsDTO,
  AlbumGenresDto,
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
  TrackDTO,
  TrackGenresDTO,
  TrackArtistsDTO,
  AlbumGenresDto,
];

export const ServerDTO = [AdminDTO, AdminLoginDTO, RegisterAdminDTO];
