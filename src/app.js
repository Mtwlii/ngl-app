import express from "express";
import cors from "cors";
import { correlationId } from "./lib/correlation/correlationId.js";
import cookieParser from "cookie-parser";
import { env } from "./lib/config/env.js";


import {globalErrorHandler} from "./lib/error/error.handler.js";
import {router} from "./route.js";

export function createApp() {
    const app = express();

    // behind a reverse proxy (Render/Railway/Nginx) req.ip would otherwise be the proxy's IP,
    // which makes every rate limiter count all users as one
    app.set("trust proxy", 1);

    app.use(
        env.clientOrigin
            ? cors({origin: env.clientOrigin, credentials: true})
            : cors(),
    );
    // get static path
    app.use('/uploads', express.static("uploads"));
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
