import { toMs } from "../../../common/Utils/time.js";
import jwt from "jsonwebtoken"; 

export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: toMs(1, "houres"),
  });
}
