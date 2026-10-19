import * as z from "zod";

const email = z.string().trim().toLowerCase().email();
const otpCode = z.string().trim().length(6);
const password = z.string().min(8).max(64);
const name = z
  .string()
  .trim()
  .toLowerCase()
  .transform((val) => val.replace(/\s+/g, ""))
  .pipe(z.string().min(2).max(32));
export const RegisterDto = z.object({
  email,
  name,
  password,
  dob: z.coerce.date().optional(),
  gender: z.enum(["male", "female", "other"]).default("other"),
});
// .strict()
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
