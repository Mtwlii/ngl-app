import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import { AppError } from "../../lib/error/error.js";

// allowed file types are specified in the allowedTypes array
export const allowedFields = {
  images: ["image/jpeg", "image/png"],
  documents: ["application/pdf", "application/msword"],
  videos: ["video/mp4", "video/avi"],
  audio: ["audio/mpeg", "audio/wav"],
  archives: ["application/zip", "application/x-tar"],
  all: [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "video/mp4",
    "video/avi",
    "audio/mpeg",
    "audio/wav",
    "application/zip",
    "application/x-tar",
  ],
};

// Middleware to validate file type by magic number (file signatures)
export const fileValidation =
  (allowedTypes = allowedFields.images) =>
  async (req, _res, next) => {
    try {
      //check size of the uploaded file
      const fileSize = req.file.size;
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (fileSize > maxSize) {
        fs.unlinkSync(req.file.path);
        return next(new AppError("File size exceeds the limit of 5MB", 400));
      }
      // get the file path
      const filePath = req.file.path;
      // read the file and return buffer
      const buffer = fs.readFileSync(filePath);
      // get the file type
      const type = await fileTypeFromBuffer(buffer);
      // validate
      if (!type || !allowedTypes.includes(type.mime)) {
        fs.unlinkSync(filePath);
        return next(new AppError("Invalid file type", 400));
      }
      return next();
    } catch (error) {
      return next(new AppError("Internal server error", 500));
    }
  };
