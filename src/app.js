import express from "express";
import cors from "cors";
import { correlationId } from "./lib/correlation/correlationId.js";
import cookieParser from "cookie-parser";


import {globalErrorHandler} from "./lib/error/error.handler.js";
import {router} from "./route.js";

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());
    // Parsing JSON request bodies
    app.use(cookieParser());
    // Correlation ID middleware
    app.use(correlationId);

    // Routes
    app.use('/api', router);

    app.use((_req, res) => {
        res.status(404).json({message: "Route not found", success: false});
    });


    app.use(globalErrorHandler);

    return app;
}
