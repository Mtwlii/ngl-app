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
connect();

const app = express();

app.use(cors());

// parse application/json from buffers to json
app.use(express.json());

//Router
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/message", messageRouter);

//Erorr handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    success: false,
    message: err.message,
    stack: err.stack,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
