import { OAuth2Client } from "google-auth-library";
import { AppError } from "../error/error.js";
import { env } from "../config/env.js";

const client = new OAuth2Client();
export async function verifyGoogleToken(idToken) {
  try {
    const Ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: env.googleOauth.clientId,
    });
    return Ticket.getPayload();
  } catch (error) {
    throw new AppError("invalid google Token", 403);
  }
}
