import {User} from "../../user/model/user.model.js";
import { OTP } from "../../auth/model/otp.model.js";

export async function checkUserEmailExists(email) {
  return await User.findOne({ email });
}

export async function createUser(userData) {
  return await User.create(userData);
}

export async function createOTP(otpData) {
  return await OTP.create(otpData);
}