import { logger } from "../../pkg/logger/logger.js";

// Turn well-known library errors into client errors instead of a generic 500.
function normalize(err) {
  // multer (file too large, unexpected field, ...)
  if (err?.name === "MulterError") {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File size exceeds the limit of 5MB"
        : err.message;
    return { statusCode: 400, message };
  }
  // mongoose schema validation
  if (err?.name === "ValidationError" && err.errors) {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return { statusCode: 400, message };
  }
  // mongoose bad ObjectId etc.
  if (err?.name === "CastError") {
    return { statusCode: 400, message: `Invalid ${err.path}` };
  }
  // duplicate key (e.g. two simultaneous registrations with the same email)
  if (err?.code === 11000) {
    return { statusCode: 409, message: "Resource already exists" };
  }
  // malformed JSON body
  if (err?.type === "entity.parse.failed") {
    return { statusCode: 400, message: "Invalid JSON body" };
  }
  return null;
}

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

  const known = normalize(err);
  if (known) {
    return res.status(known.statusCode).json({
      message: known.message,
      success: false,
    });
  }

  return res.status(500).json({
    message: "Something went wrong, Internal Server Error",
    success: false,
  });
}
