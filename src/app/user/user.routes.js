import { Router } from "express";
import { withCache } from "../../lib/cache/withCache.js";
import {
  allowedFields,
  fileValidation,
} from "../../pkg/media/file.validation.js";
import { uploadFilesArray, uploadSingleFile } from "../../pkg/media/multer.js";
import { updateProfilePicController } from "./controller/user.controller.js";
import { authGuard } from "../../lib/auth/guard.js";
import { User } from "./model/user.model.js";

const userRouter = Router();

userRouter.get("/get-all-users", withCache, (_req, res) => {
  const data = User.find();
  res.json(data);
});

userRouter.post(
  "/upload-profile-pic",
  authGuard,
  uploadSingleFile("profilePic"),
  fileValidation(allowedFields.images),
  updateProfilePicController
);

// userRouter.post("/upload-cv", uploadFilesArray("cv", 5), (req, res) => {
//   res.json({ message: "CV uploaded successfully", file: req.file }).status(200);
// });
userRouter.post(
  "/upload-cv",
  uploadFilesArray("cv", 5),
  fileValidation(["application/pdf", "application/msword"]),
  (req, res) => {
    res
      .json({ message: "CV uploaded successfully", file: req.file })
      .status(200);
  },
);

export default userRouter;
