import { diskStorage } from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { randomUUID } from 'crypto';

export const imageStorage = () => {
  return {
    storage: diskStorage({
      destination: (req, _file, callback) => {
        let imagePath = '';

        if (req.path === '/users') {
          imagePath = 'avatar';
        }

        if (req.path === '/cocktails') {
          imagePath = 'cocktail-image';
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
