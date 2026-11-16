import * as userService from "../service/user.service.js";

export async function updateProfilePicController(req, res) {
  await userService.updateProfilePicService(req.user.id, req.file.path);
  res.json({ message: "upload profile successfully...", success: true });
}

export async function updateCvController(req, res) {
  await userService.updateCvService(req.user.id, req.file.path);
  res.json({ message: "CV uploaded successfully", success: true });
}

export async function getAllUsersController(_req, res) {
  const users = await userService.getAllUsers();
  res.json({ success: true, data: users });
}
