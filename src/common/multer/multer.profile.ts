import { Injectable } from '@nestjs/common';
import { MulterConfig } from './multer.config';
import { MulterFileFilter } from './multer.filter';
import { MulterStorage } from './multer.storage';

@Injectable()
export class MulterProfiles {
  constructor(
    private readonly multerFilter: MulterFileFilter,
    private readonly multerStorage: MulterStorage,
  ) {}

  importProfile() {
    return {
      storage: this.multerStorage.disk('IMPORT'),
      limits: { fileSize: MulterConfig.FILE_SIZE_LIMIT.IMPORT },
      fileFilter: this.multerFilter.create('IMPORT'),
    };
  }

  audioProfile() {
    return {
      storage: this.multerStorage.disk('AUDIO', { renameAudio: true }),
      limits: { fileSize: MulterConfig.FILE_SIZE_LIMIT.AUDIO },
      fileFilter: this.multerFilter.create('AUDIO'),
    };
  }

  imageProfile() {
    return {
      storage: this.multerStorage.disk('IMAGE'),
      limits: { fileSize: MulterConfig.FILE_SIZE_LIMIT.IMAGE },
      fileFilter: this.multerFilter.create('IMAGE'),
    };
  }
}
