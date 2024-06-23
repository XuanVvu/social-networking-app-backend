import { extname } from 'path';
import { diskStorage } from 'multer';

export const storageConfig = (folder: string) =>
  diskStorage({
    destination: `uploads/${folder}`,
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

export const imageFileFilter = (req, file, callback) => {
  const ext = extname(file.originalname).toLowerCase();
  const allowedExtArr = ['.jpg', '.jpeg', '.png'];
  if (!allowedExtArr.includes(ext)) {
    req.fileValidationErr = `Only image files are allowed: ${allowedExtArr.join(
      ', ',
    )}`;
    return callback(null, false);
  }

  const fileSize = parseInt(req.headers['content-length']);
  if (fileSize > 1024 * 1024 * 5) {
    req.fileValidationError = `File size too large. Maximum file size allowed is 5MB`;
    return callback(null, false);
  }
  callback(null, true);
};
