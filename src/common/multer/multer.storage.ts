import { Injectable } from '@nestjs/common';
import { diskStorage, memoryStorage } from 'multer';
import { MulterConfig } from './multer.config';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { AudioFilenameHelper } from './audio-filename.helper';

@Injectable()
export class MulterStorage {
  constructor(private readonly audioFilename: AudioFilenameHelper) {}

  memory() {
    return memoryStorage();
  }

  disk(
    category: keyof typeof MulterConfig.UPLOAD_CATALOG,
    options?: { renameAudio?: boolean },
  ) {
    const uploadPath = MulterConfig.UPLOAD_FOLDERS[category];

    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    return diskStorage({
      destination: uploadPath,
      filename: (req, file, cb) => {
        if (
          options?.renameAudio &&
          category === 'AUDIO' &&
          req.body.artistId &&
          req.body.songId
        ) {
          return cb(
            null,
            this.audioFilename.generate({
              artistId: req.body.artistId,
              songId: req.body.songId,
              originalName: file.originalname,
            }),
          );
        }

        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, unique + path.extname(file.originalname));
      },
    });
  }
}
