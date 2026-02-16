import { extname } from 'path';
import { Injectable } from '@nestjs/common';
import { MulterConfig } from './multer.config';
import { InvalidMimeTypeException } from '@exceptions';

@Injectable()
export class MulterFileFilter {
  create(category: keyof typeof MulterConfig.UPLOAD_CATALOG) {
    return (req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase();

      if (
        !MulterConfig.MIME_TYPES[category].includes(file.mimetype) ||
        !MulterConfig.FILE_EXTENSIONS[category].includes(ext)
      ) {
        return cb(new InvalidMimeTypeException(file.mimetype), false);
      }
      cb(null, true);
    };
  }
}
