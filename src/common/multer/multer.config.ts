import path from 'path';
class MulterConfig {
  static readonly SRC_ROOT = path.join(process.cwd(), 'src');

  static readonly UPLOAD_CATALOG = {
    IMPORT: 'import',
    AUDIO: 'audio',
    IMAGE: 'image',
  } as const;

  static readonly FILE_SIZE_LIMIT = {
    IMPORT: 10 * 1024 * 1024,
    AUDIO: 200 * 1024 * 1024,
    IMAGE: 5 * 1024 * 1024,
  };

  static readonly MIME_TYPES = {
    IMPORT: [
      'application/json',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],

    AUDIO: [
      'audio/mpeg',
      'audio/flac',
      'audio/wav',
      'audio/x-wav',
      'audio/aac',
    ],

    IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
  };

  static readonly FILE_EXTENSIONS = {
    IMPORT: ['.json', '.csv', '.xlsx'],
    AUDIO: ['.mp3', '.flac', '.wav', '.aac'],
    IMAGE: ['.jpg', '.jpeg', '.png', '.webp'],
  };

  static readonly UPLOAD_FOLDERS = {
    IMPORT: path.join(MulterConfig.SRC_ROOT, 'uploads/imports'),
    AUDIO: path.join(MulterConfig.SRC_ROOT, 'uploads/audio/tracks'),
    IMAGE: path.join(MulterConfig.SRC_ROOT, 'uploads/images'),
  };
}

export { MulterConfig };
