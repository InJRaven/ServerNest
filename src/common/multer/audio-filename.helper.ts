import path from 'path';
import crypto from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AudioFilenameHelper {
  generate(params: {
    artistId: string;
    songId: string;
    originalName: string;
  }): string {
    const ext = path.extname(params.originalName).toLowerCase();

    const hash = crypto
      .createHash('md5')
      .update(`${params.artistId}-${params.songId}-${Date.now()}`)
      .digest('hex')
      .slice(0, 6);

    return `${params.artistId}_${params.songId}_${hash}${ext}`;
  }
}
