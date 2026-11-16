import crypto from "crypto";
import multer, { diskStorage } from "multer";
import { AppError } from "../../lib/error/error.js";

// storage configuration
// 1- disk storage --> saves files directly to disk hdd
//  where to save the files on disk
//  what is file name
// 2- memory storage --> ram for temporary storage

function multerUpload(
  allawedType = ["image/jpeg", "image/png", "application/pdf"],
) {
  return multer({
    fileFilter: function (_req, file, cb) {
      if (allawedType.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new AppError("Invalid file type", 400), false);
      }
    },
    storage: diskStorage({
      destination: "uploads",
      filename: function (_req, file, cb) {
        console.log(file); //{ fieldname, originalname, encoding, mimetype, buffer, size }
        //pdf files will have .pdf extension
        // cb(null, Date.now() + '-' + file.originalname.split('.').pop());
        cb(null, crypto.randomUUID() + "-" + file.originalname);
      },
    }),
  });
}

export function uploadSingleFile(
  fileName,
  allawedType = ["image/jpeg", "image/png", "application/pdf"],
) {
  return multerUpload(allawedType).single(fileName);
}
export function uploadFilesArray(
  fileName,
  maxCount,
  allawedType = ["application/pdf", "application/msword"],
) {
  return multerUpload(allawedType).array(fileName, maxCount);
}
export function uploadFieldsFile(fields) {
  return multerUpload().fields(fields);
}
