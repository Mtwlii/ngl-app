import * as authRepository from "../repository/auth.repository.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import * as userRepository from "../../user/repository/user.repository.js";
import { sendEmail } from "../../../common/email/nodemailer.js";
import { toMs } from "../../../common/Utils/time.js";
import { otpExpired, otpInvalid, InvalidEmailOrPass } from "../errors.js";
import {
  userNotExist,
  userVerified,
  userAlreadyExists,
  userNotVerified,
} from "../../user/errors.js";

//1- register
export async function register(userData) {
  //1- check if user already exists
  const userExists = await authRepository.checkUserEmailExists(userData.email);
  //2- if yes, throw an error
  if (userExists) throw userAlreadyExists;
  //3- if no,prepare data [hash password]
  userData.password = await bcrypt.hash(userData.password, 10);
  //4- save user to database [verify email false]
  const createdUser = await authRepository.createUser(userData);
  //5- send activation OTP     to user's email
  const otp = crypto.randomInt(100000, 999999).toString();
  await authRepository.createOTP({
    otpCode: otp,
    email: createdUser.email,
    expireAt: new Date(Date.now() + toMs(5, "minutes")),
  });
  //6- return user
  await sendEmail(
    createdUser.email,
    "verify your account",
    `<p>Your verification otpCode is: ${otp}</p>`,
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
  if (!user) throw new userNotExist();
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

export async function login(email, password) {
  //1. check if user exists
  const user = await authRepository.checkUserEmailExists(email);
  //2. if not exist, throw an error
  if (!user) throw userNotExist;
  // isVerified
  if (user.isVerified === false) throw userNotVerified;
  //3. if user exists, check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  //4. if password is correct, return user
  if (!isPasswordCorrect) throw InvalidEmailOrPass;
  //5. if password is correct, generate Token
  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: toMs(1, "hours"),
    },
  );
  //7. return user
  return token;
}
