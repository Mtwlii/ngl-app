import bcrypt from "bcrypt";

// hash Password
export async function hashedPasswod(password) {
  return bcrypt.hash(password, 10);
}

// compare password with hashedPasswod 
export async function comparePassword(password, hashedPasswod) {
  return bcrypt.compare(password, hashedPasswod);
}
