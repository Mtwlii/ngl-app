import { Router } from "express";
import { withCache } from "../../lib/cache/withCache.js";
import {
  allowedFields,
  fileValidation,
} from "../../pkg/media/file.validation.js";
import { uploadSingleFile } from "../../pkg/media/multer.js";
import {
  getAllUsersController,
  updateCvController,
  updateProfilePicController,
} from "./controller/user.controller.js";
import { authGuard } from "../../lib/auth/guard.js";

const userRouter = Router();

// authenticated, cached for 60s (note: withCache(...) must be CALLED), public-safe fields only
userRouter.get(
  "/get-all-users",
  authGuard,
  withCache(60),
  getAllUsersController,
);

userRouter.post(
  "/upload-profile-pic",
  authGuard,
  uploadSingleFile("profilePic", allowedFields.images),
  fileValidation(allowedFields.images),
  updateProfilePicController,
);

// PDF only: file-type reports legacy .doc as application/x-cfb, so msword can't pass magic-number validation
userRouter.post(
  "/upload-cv",
  authGuard,
  uploadSingleFile("cv", ["application/pdf"]),
  fileValidation(["application/pdf"]),
  updateCvController,
);

export default userRouter;
