import { logger } from "../../pkg/logger/logger.js";

export function globalErrorHandler(err, req, res, _next) {
    const correlationId = req.correlationId;
    
    logger.error(err.message, {
        stack: err.stack,
        correlationId,
    });

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
}