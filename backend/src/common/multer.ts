import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

export const imageStorage = () => {
  return {
    storage: diskStorage({
      destination: (req, _file, callback) => {
        let imagePath = '';

        if (req.path === '/users') {
          imagePath = 'avatars';
        }

        if (req.path === '/cocktails') {
          imagePath = 'cocktail-images';
        }
        const destDir = path.join('public', imagePath);
        fs.mkdirSync(destDir, { recursive: true });
        callback(null, destDir);
      },
      filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname);
        callback(null, randomUUID() + extension);
      },
    }),
  };
};
