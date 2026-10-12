import * as authRepository from "../repository/auth.repository.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { sendEmail } from "../../../common/email/nodemailer.js";

export async function register(userData) {
  //1- check if user already exists
  const userExists = await authRepository.checkUserEmailExists(userData.email);
  //2- if yes, throw an error
  if (userExists) throw new Error("User already exists");
  //3- if no,prepare data [hash password]
  userData.password = await bcrypt.hash(userData.password, 10);
  //4- save user to database [verify email false]
  const createdUser = await authRepository.createUser(userData);
  //5- send activation OTP     to user's email
  const otp = crypto.randomInt(100000, 999999).toString();
  await authRepository.createOTP({
    otpCode: otp,
    email: createdUser.email,
    expireAt: new Date(Date.now() + 5 * 60 * 1000),
  });
  //6- return user
  await sendEmail(
    createdUser.email,
    "verify your account",
    `<p>Your verification otpCode is: ${otp}</p>`,
  );
  return createdUser;
}

export async function verifyOTP(email, otpCode) {
  //1.1 check if user exists
  const user = await authRepository.checkUserEmailExists(email);
  //1.2 if not exist, throw an error
  if (!user) throw new Error("User does not exist");
  //2. check is verified or not
  if(user.isVerified) throw new Error("User is already verified");
  //2.1 check if the otp is valid
  const otp = await authRepository.checkOTP(email, otpCode);
  //2.2 if not valid, throw an error
  if (!otp) throw new Error("Invalid OTP");
  //3.1 check if the otp no equle to the user's otp and if the otp is expired
  if (otp.otpCode !== otpCode)
    throw new Error("Invalid OTP");
  //3.2 if expired, throw an error
  //4.1 if valid and not expired, update user's verified field to true
  await authRepository.verifyUser(user._id);
  //4.2 return user
  return user;
  //5.1 if valid and not expired, update user's verified field to true
  //delete otp from database

  //5.2 return user
}
