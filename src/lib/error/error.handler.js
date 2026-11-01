import {logger} from "../../pkg/logger/logger.js";

export function globalErrorHandler(err, req, res) {

    // console.error(err.stack);
    logger.error(err.message, {stack: err.stack});

    if (err.isOperational === true) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: false
        })
    }
    return res.status(500).json({
        message: 'Something went wrong',
        success: false
    })
}

