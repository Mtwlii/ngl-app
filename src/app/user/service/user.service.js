import fs from "fs";
import * as userRepository from "../repository/user.repository.js";
import { userNotExist } from './../errors.js';

export async function updateProfilePicService(userId, newProfilePicPath) {
  // Find user to get old profile picture path
  const user = await userRepository.findUserById(userId);
  if (!user) throw userNotExist;

  // Delete old profile picture from server if it exists
  if (user.profilePicPath) {
    fs.unlinkSync(user.profilePicPath);
  }

  // Update user with new profile picture path
  return await userRepository.updateProfilePicPath(userId, newProfilePicPath);
}
