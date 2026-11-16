import { User } from "../../user/model/user.model.js";
import { OTP } from "../../auth/model/otp.model.js";

// Check User is Exist
export async function checkUserEmailExists(email) {
  return await User.findOne({ email: email });
}

// Create User
export async function createUser(userData) {
  return await User.create(userData);
}

// Create OTP
export async function createOTP(otpData) {
  return await OTP.create(otpData);
}

// Get Otp By Email
export async function getOtpByEmail(email) {
  return await OTP.findOne({ email: email });
}

// delete otp
export async function deleteOtpByEmail(email) {
  return await OTP.deleteMany({ email: email });
}
