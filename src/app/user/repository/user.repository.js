import { User } from "../model/user.model.js";

export async function findUserById(id) {
  return await User.findOne({ _id: id });
}

export async function updateUserByEmail(email, updatedData) {
  return await User.findOneAndUpdate({ email }, updatedData, {
    returnDocument: "after",
  });
}

export async function updateProfilePicPath(userId, profilePicPath) {
  return await User.findOneAndUpdate(
    { _id: userId },
    { profilePicPath: profilePicPath },
    { returnDocument: "after" }
  );
}
