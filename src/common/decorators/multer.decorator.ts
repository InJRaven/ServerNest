import { SetMetadata } from '@nestjs/common';

export enum MulterProfileType {
  IMPORT = 'IMPORT',
  AUDIO = 'AUDIO',
  IMAGE = 'IMAGE',
}

export const MULTER_PROFILE_KEY = 'MULTER_PROFILE';

export const UseMulterProfile = (profile: MulterProfileType) =>
  SetMetadata(MULTER_PROFILE_KEY, profile);
