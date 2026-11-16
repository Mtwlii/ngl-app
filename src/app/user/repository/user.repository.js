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


export async function updateCvPath(userId, cvPath) {
  return await User.findOneAndUpdate(
    { _id: userId },
    { cvPath },
    { returnDocument: "after" }
  );
}

// public-safe listing: only verified, non-deleted users, only their name (+ _id)
export async function findPublicUsers() {
  return await User.find({ isVerified: true, isDeleted: false })
    .select("name")
    .lean();
}
