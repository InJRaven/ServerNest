import { Module } from '@nestjs/common';
import {
  AudioFilenameHelper,
  MulterFactory,
  MulterFileFilter,
  MulterProfiles,
  MulterStorage,
} from '../../common/multer';

@Module({
  providers: [
    MulterFileFilter,
    MulterStorage,
    MulterProfiles,
    AudioFilenameHelper,
    MulterFactory,
  ],
  exports: [MulterProfiles, MulterFactory],
})
export class MulterConfigModule {}
