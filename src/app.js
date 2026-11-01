import express from "express";
import cors from "cors";


import {globalErrorHandler} from "./lib/error/error.handler.js";
import {router} from "./route.js";

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api', router);

    app.use((_req, res) => {
        res.status(404).json({message: "Route not found", success: false});
    });


    app.use(globalErrorHandler);

    return app;
}