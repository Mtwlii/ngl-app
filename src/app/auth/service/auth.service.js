import * as authRepository from "../repository/auth.repository.js";
import * as userRepository from "../../user/repository/user.repository.js";
// import { sendEmail } from "../../../lib/email/nodemailer.js";
import { mailjetProvider } from './../../../lib/email/init.js';
import { toMs } from "../../../pkg/utils/time.js";
import { otpExpired, otpInvalid, InvalidEmailOrPass } from "../errors.js";
import { otpEmailTemplate } from "../../../lib/email/otpTemplate.js";
import {
  userNotExist,
  userVerified,
  userAlreadyExists,
  userNotVerified,
} from "../../user/errors.js";
import { generateOtpCode } from "../../../lib/Utils/otp.js";
import { generateToken } from "../utils/token.js";
import { comparePassword, hashedPasswod } from "../utils/hash.js";
import { verifyGoogleToken } from "../../../lib/Utils/google-auth.js";
import { AppError } from "../../../lib/error/error.js";

//1- register
export async function register(userData) {
  //1- check if user already exists
  const userExists = await authRepository.checkUserEmailExists(userData.email);
  //2- if yes, throw an error
  if (userExists) throw userAlreadyExists;
  //3- if no,prepare data [hash password]
  userData.password = await hashedPasswod(userData.password);
  //4- save user to database [verify email false]
  const createdUser = await authRepository.createUser(userData);
  //5- send activation OTP     to user's email
  const otpCode = generateOtpCode();
  await authRepository.createOTP({
    otpCode: otpCode,
    email: createdUser.email,
    expireAt: new Date(Date.now() + toMs(5, "minutes")),
  });
  //6- return user
  await mailjetProvider.sendMail(
    createdUser.email,
    "Verify your account",
    otpEmailTemplate({ name: createdUser.name, otpCode, expiresInMinutes: 5 }),
  );
  return createdUser;
}

//2- verify
export async function verifyOTP(email, otpCode) {
  // 1- check user
  const user = await authRepository.checkUserEmailExists(email);
  if (!user) throw userNotExist;
  if (user.isVerified) throw userVerified;

  // 2- check otp exists
  const otp = await authRepository.getOtpByEmail(email);
  if (!otp) throw otpExpired;

  // 3- check expiry by time (don't rely only on the TTL index)
  if (otp.expireAt <= new Date()) {
    await authRepository.deleteOtpByEmail(email);
    throw otpExpired;
  }

  // 4- keep the otp until it expires
  if (String(otp.otpCode) !== String(otpCode)) throw otpInvalid;

  // 5- delete the otp BEFORE updating the user
  await authRepository.deleteOtpByEmail(email);

  // 6- mark user as verified
  return userRepository.updateUserByEmail(email, { isVerified: true });
}
//3- login
export async function login(email, password) {
  const user = await authRepository.checkUserEmailExists(email);
  if (!user) throw userNotExist;
  if (user.isVerified === false) throw userNotVerified;

  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) throw InvalidEmailOrPass;

  return generateToken({ id: user._id, name: user.name });
}

//4- reSend OTP

export async function sendOtp(email) {
  // 1- check user exists
  const user = await authRepository.checkUserEmailExists(email);
  if (!user) throw userNotExist;

  // 2- delete old otp if exists
  await authRepository.deleteOtpByEmail(email);

  // 3- generate and save new otp
  const otpCode = generateOtpCode();
  await authRepository.createOTP({
    otpCode,
    email,
    expireAt: new Date(Date.now() + toMs(3, "minutes")),
  });

  // 4- send email
  await mailjetProvider.sendMail(
    email,
    "New verification code",
    otpEmailTemplate({ name: user.name, otpCode, expiresInMinutes: 3 }),
  );
}

//5- reset password
export async function resetPassword(email, otpCode, newPassword) {
  // 1- check otp exists
  const otp = await authRepository.getOtpByEmail(email);
  if (!otp) throw otpExpired;

  // 2- check expiry by time
  if (otp.expireAt <= new Date()) {
    await authRepository.deleteOtpByEmail(email);
    throw otpExpired;
  }

  // 3- wrong code: keep the otp until it expires
  if (String(otp.otpCode) !== String(otpCode)) throw otpInvalid;

  // 4- delete the otp BEFORE changing the password
  await authRepository.deleteOtpByEmail(email);

  // 5- hash and update password
  const hashedPassword = await hashedPasswod(newPassword);
  return userRepository.updateUserByEmail(email, {
    password: hashedPassword,
  });
}

// ! Login With Google
export async function loginWithGoogle(idToken) {
  //1- verify idToken
  const payload = await verifyGoogleToken(idToken);
  if (!payload?.email || payload.email_verified !== true) {
    throw new AppError("Google account email is not verified", 403);
  }
  const email = payload.email.toLowerCase();
  //2- check user exist
  const user = await authRepository.checkUserEmailExists(email);
  //3- if exist >> generate Token
  if (user) {
    return generateToken({ id: user.id, email: user.email });
  }
  //4- if not exist >> Create User >> Generate Token
  const createdUser = await authRepository.createUser({
    name: (String(payload.name ?? "").trim().length >= 3
      ? String(payload.name).trim()
      : email.split("@")[0]
    ).slice(0, 20),
    email,
    provider: "google",
    isVerified: true,
  });
  return generateToken({ id: createdUser.id, email: createdUser.email });
}
