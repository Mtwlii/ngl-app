import { Router } from "express";
import { withCache } from "../../lib/cache/withCache.js";
import { toSeconds } from "../../pkg/utils/time.js";
import { User } from './model/user.model.js';

const userRouter = Router();

userRouter.get("/get-all-users", withCache, (req, res) => {
  const data = User.find();
  res.json(data);
});

export default userRouter;
