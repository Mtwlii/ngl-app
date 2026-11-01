import { config } from "dotenv";
import "dotenv/config";
import { z } from "zod";
config()
const envSchema = z.object({
  PORT: z.string().default("3000").transform((val) => parseInt(val, 10)),

  MONGO_URL: z.string().min(1, { message: "MONGO_URL is required" }),

  EMAIL_USER: z.string().email({ message: "EMAIL_USER must be a valid email address" }),
  EMAIL_PASS: z.string().min(1, { message: "EMAIL_PASS is required" }),
  EMAIL_HOST: z.string().min(1, { message: "EMAIL_HOST is required" }),
  EMAIL_PORT: z.string().transform((val) => parseInt(val, 10)),

  JWT_SECRET: z.string().min(10, { message: "JWT_SECRET must be at least 10 characters long" }),
  JWT_EXPIRES_IN: z.string().transform((val) => parseInt(val, 10)),

  GOOGLE_OAUTH_CLIENT_ID: z.string().min(1, { message: "GOOGLE_OAUTH_CLIENT_ID is required" }),

  REDIS_HOST: z.string().min(1, { message: "REDIS_HOST is required" }),
  REDIS_PORT: z.string().transform((val) => parseInt(val, 10)),
  REDIS_PASSWORD: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(parsed.error.format(), null, 2)); 
  process.exit(1);
}

const data = parsed.data; // <-- the actual values

export const env = {
  port: data.PORT,
  db: { url: data.MONGO_URL },
  jwt: {
    secret: data.JWT_SECRET,
    expiresIn: data.JWT_EXPIRES_IN,
  },
  googleOauth: { clientId: data.GOOGLE_OAUTH_CLIENT_ID },
  email: {
    user: data.EMAIL_USER,
    pass: data.EMAIL_PASS,
    host: data.EMAIL_HOST,
    port: data.EMAIL_PORT,
  },
  redis: {
    host: data.REDIS_HOST,
    port: data.REDIS_PORT,
    password: data.REDIS_PASSWORD,
  },
};
