import { fileTypeFromFile } from "file-type";
import fs from "node:fs/promises";
import { AppError } from "../../lib/error/error.js";

// allowed file types (real MIME types detected from the file's magic number)
export const allowedFields = {
  images: ["image/jpeg", "image/png"],
  documents: ["application/pdf"],
  videos: ["video/mp4"],
  audio: ["audio/mpeg", "audio/wav"],
  archives: ["application/zip", "application/x-tar"],
};

const removeFiles = (files) =>
  Promise.all(files.map((f) => fs.rm(f.path, { force: true })));

// Middleware: validates uploaded file(s) by magic number. Works with .single() and .array().
// Reads only the file header from disk (fileTypeFromFile) instead of loading the whole file in RAM.
export const fileValidation =
  (allowedTypes = allowedFields.images) =>
  async (req, _res, next) => {
    const files = req.files ?? (req.file ? [req.file] : []);
    try {
      if (files.length === 0) {
        return next(new AppError("File is required", 400));
      }
      for (const file of files) {
        const type = await fileTypeFromFile(file.path);
        if (!type || !allowedTypes.includes(type.mime)) {
          await removeFiles(files);
          return next(new AppError("Invalid file type", 400));
        }
      }
      return next();
    } catch (error) {
      await removeFiles(files).catch(() => {});
      return next(error);
    }
  };
