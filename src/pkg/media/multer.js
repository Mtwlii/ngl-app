import crypto from "node:crypto";
import path from "node:path";
import multer, { diskStorage } from "multer";
import { AppError } from "../../lib/error/error.js";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB, enforced while streaming (not after the upload finished)

function multerUpload(
  allowedTypes = ["image/jpeg", "image/png", "application/pdf"],
) {
  return multer({
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter(_req, file, cb) {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new AppError("Invalid file type", 400), false);
      }
    },
    storage: diskStorage({
      destination: "uploads",
      // random name + the original extension only: the client-supplied filename never touches the disk
      filename(_req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase().slice(0, 10);
        cb(null, `${crypto.randomUUID()}${ext}`);
      },
    }),
  });
}

export function uploadSingleFile(fileName, allowedTypes) {
  return multerUpload(allowedTypes).single(fileName);
}
export function uploadFilesArray(fileName, maxCount, allowedTypes) {
  return multerUpload(allowedTypes).array(fileName, maxCount);
}
export function uploadFieldsFile(fields, allowedTypes) {
  return multerUpload(allowedTypes).fields(fields);
}
