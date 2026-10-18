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
  //1.1 check if user exists
  console.log("verify email:", JSON.stringify(email));

  const user = await authRepository.checkUserEmailExists(email);
  console.log("user found:", user);

  //1.2 if not exist, throw an error
  if (!user) throw userNotExist();
  //2. check is verified or not
  if (user.isVerified) throw userVerified;
  //3. check if otp is valid
  const otp = await authRepository.getOtpByEmail(email);
  if (!otp) throw otpExpired;
  if (otp.otpCode !== otpCode) throw otpInvalid;
  //4. if otp is valid, set isVerified to true
  const updatedUser = await userRepository.updateUserByEmail(email, {
    isVerified: true,
  });
  //5. delete otp
  await authRepository.deleteOtpByEmail(email);

  //5. return user
  return updatedUser;
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

  // 2- if already verified, stop here (no OTP, no email)
  if (user.isVerified === true) throw userVerified;

  // 3- delete old otp if exists
  await authRepository.deleteOtpByEmail(email);

  // 4- generate and save new otp
  const otpCode = generateOtpCode();
  await authRepository.createOTP({
    otpCode,
    email,
    expireAt: new Date(Date.now() + toMs(3, "minutes")),
  });

  // 5- send email
  await sendEmail(
    email,
    "New verification code",
    otpEmailTemplate({ name: user.name, otpCode, expiresInMinutes: 3 }),
  );
}
