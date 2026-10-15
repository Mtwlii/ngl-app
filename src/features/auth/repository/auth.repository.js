import { User } from "../../user/model/user.model.js";
import { OTP } from "../../auth/model/otp.model.js";

export async function checkUserEmailExists(email) {
  return await User.findOne({ email: email });
}

export async function createUser(userData) {
  return await User.create(userData);
}

export async function createOTP(otpData) {
  return await OTP.create(otpData);
}

export async function getOtpByEmail(email) {
  return await OTP.findOne({ email: email });
}

//delete otp
export async function deleteOtpByEmail(email) {
  return await OTP.deleteMany({ email: email });
}

//is correct password

export async function isPasswordCorrect(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

//update user by email
// export async function updateUserByEmail(email, updatedData) {
//   return await User.findOneAndUpdate({ email }, updatedData, {
//     returnDocument: "after",
//   }); // {new: true} returns the updated document instead of the original one.
// }
