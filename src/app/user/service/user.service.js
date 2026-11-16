import fs from "node:fs/promises";
import * as userRepository from "../repository/user.repository.js";
import { userNotExist } from "./../errors.js";

// force: true => no error if the old file is already gone
const removeFile = (path) => (path ? fs.rm(path, { force: true }) : undefined);

export async function updateProfilePicService(userId, newProfilePicPath) {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    await removeFile(newProfilePicPath);
    throw userNotExist;
  }

  const updated = await userRepository.updateProfilePicPath(
    userId,
    newProfilePicPath,
  );
  await removeFile(user.profilePicPath); // delete the old picture only after the DB update succeeded
  return updated;
}

export async function updateCvService(userId, newCvPath) {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    await removeFile(newCvPath);
    throw userNotExist;
  }

  const updated = await userRepository.updateCvPath(userId, newCvPath);
  await removeFile(user.cvPath);
  return updated;
}

export async function getAllUsers() {
  return await userRepository.findPublicUsers();
}
