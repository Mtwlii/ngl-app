import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

// import routes
import userRouter from "./features/user/user.routes.js";
import messageRouter from "./features/message/message.routes.js";
import authRouter from "./features/auth/auth.routes.js";
import { connect } from "./common/DB/mongoose.js";
import { OTP } from "./features/auth/model/otp.model.js";
import { logger } from "./common/logger/logger.js";
connect();

const app = express();

app.use(cors());

// parse application/json from buffers to json
app.use(express.json());

//Router
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/message", messageRouter);

// Global Erorr handling middleware
app.use((err, req, res, next) => {
  // console.error(err.stack);
  logger.error(err.message,err)

  if (err.isOperational === true) {
    return res.status(err.statusCode).json({
      message: err.message,
      success: false,
    });
  }

  return res.status(500).json({
    message: "Something went wrong, Internal Server Error",
    success: false,
  });
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
