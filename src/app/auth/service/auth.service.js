import * as authRepository from "../repository/auth.repository.js";
import * as userRepository from "../../user/repository/user.repository.js";
import { sendEmail } from "../../../common/email/nodemailer.js";
import { toMs } from "../../../common/Utils/time.js";
import { otpExpired, otpInvalid, InvalidEmailOrPass } from "../errors.js";
import { otpEmailTemplate } from "../../../common/email/otpTemplate.js";
import {
  userNotExist,
  userVerified,
  userAlreadyExists,
  userNotVerified,
} from "../../user/errors.js";
import { generateOtpCode } from "../../../common/Utils/otp.js";
import { generateToken } from "../utils/token.js";
import { comparePassword, hashedPasswod } from "../utils/hash.js";
import { verifyGoogleToken } from "../../../common/Utils/google-auth.js";

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
  await sendEmail(
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

// export async function login(email, password) {
//   //1. check if user exists
//   const user = await authRepository.checkUserEmailExists(email);
//   //2. if not exist, throw an error
//   if (!user) throw userNotExist;
//   // isVerified
//   if (user.isVerified === false) throw userNotVerified;
//   //3. if user exists, check if password is correct
//   const isPasswordCorrect = await comparePassword(password, user.password);
//   //4. if password is correct, return user
//   if (!isPasswordCorrect) throw InvalidEmailOrPass;
//   //5. if password is correct, generate Token
//   const token = generateToken({ id: user._id, name: user.name });
//   //7. return user
//   return token;
// }

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
  await sendEmail(
    email,
    "New verification code",
    otpEmailTemplate({ name: user.name, otpCode, expiresInMinutes: 3 }),
  );
}

//5- forget password

// export async function forgitPassword(email ,otpCode, newPassword) {
//   // 1- check is user Exist
//   const user =await authRepository.checkUserEmailExists
//   // 2- throw Error if not exist
//   if(!user) throw userNotExist;
//   // 3- send OTP to email
//   const sendOTP= await authRepository.createOTP;
//   // 4- compaer OTP with DB
//   const verifayOTP = user.otpCode === otpCode
//   // 5- verifay OTP and reDairect To Create New password and confairm password
// }

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
  console.log(payload);
  //2- check user exist
  const user = await authRepository.checkUserEmailExists(payload.email);
  //3- if exist >> generate Token
  if (user) {
    return generateToken({
      id: user.id,
      email: user.email,
    });
  }
  //4- if not exist >> Create User >> Generate Token
  const createdUser = await authRepository.createUser({
    name: payload.name,
    email: payload.email,
    provider: "google",
    isVerified: true,
  });
  return generateToken({
    id: createdUser._id,
    email: createdUser.email,
  });
}
