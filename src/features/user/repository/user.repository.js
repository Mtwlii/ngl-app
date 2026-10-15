import { User } from "../model/user.model.js";

//update user by email
export async function updateUserByEmail(email, updatedData) {
  return await User.findOneAndUpdate({ email }, updatedData, {
    returnDocument: "after",
  }); // {new: true} returns the updated document instead of the original one.
}
