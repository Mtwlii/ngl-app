import * as z from "zod";

const email = z.string().trim().toLowerCase().email();
const otpCode = z.string().trim().length(6);
const password = z.string().min(8).max(64);
// keep the display name as typed (just trim + collapse spaces); limits match the Mongoose model (3-20)
const name = z
  .string()
  .trim()
  .transform((val) => val.replace(/\s+/g, " "))
  .pipe(z.string().min(3).max(20));

export const RegisterDto = z.object({
  email,
  name,
  password,
  dob: z.coerce.date().optional(),
  gender: z.enum(["male", "female", "other"]).default("other"),
});

export const LoginDto = z.object({
  email,
  password,
});

export const SendOtpDto = z.object({
  email,
});

export const VerifyAccountDto = z.object({
  email,
  otpCode,
});

export const ResetPasswordDto = z.object({
  email,
  otpCode,
  newPassword: password,
});

export const GoogleLoginDto = z.object({
  idToken: z.string().trim().min(1),
});
