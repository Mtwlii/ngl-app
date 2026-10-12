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

// OTP.createIndexes().then(() => {
//   console.log("Indexes created successfully");
// }).catch((err) => {
//   console.error("Error creating indexes:", err);
// });

// OTP.create({
//   code: "123456",
//   email: "VWZ2j@example.com",
//   expireAt: Date.now() + 30 * 1000,  // Set expiration time to 30 seconds from now
// })
//Erorr handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}); 