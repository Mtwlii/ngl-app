import crypto from "node:crypto";

//Generate OTP code
export function generateOtpCode() {
 return crypto.randomInt(100000, 999999).toString();
}
