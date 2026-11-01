import mongoose from "mongoose";
import { env } from "../config/env.js";

export const connect = () => {
    // console.log(env.db.url);

    mongoose
        .connect(env.db.url)
        .then(() => {
            console.log("DB connected");
        })
        .catch((err) => {
            console.log("DB connection error____________: ", err);
        });
};

// mongoose.connect("mongodb://127.0.0.1:27017/ngl-app")