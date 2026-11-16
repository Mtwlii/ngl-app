import * as userService from "../service/user.service.js";

export async function updateProfilePicController(req, res, next) {
  try {
    await userService.updateProfilePicService(
      req.user.id,
      req.file.path
    );
    res.json({ message: "upload profile successfully...", success: true });
  } catch (error) {
    next(error);
  }
}
