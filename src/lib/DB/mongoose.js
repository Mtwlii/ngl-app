import mongoose from "mongoose";

export const connect = () => {
    console.log(process.env.MONGO_URL);
    mongoose
        .connect(process.env.MONGO_URL)
        .then(() => {
            console.log("DB connected");
        })
        .catch((err) => {
            console.log("DB connection error____________: ", err);
        });
};

// mongoose.connect("mongodb://127.0.0.1:27017/ngl-app")