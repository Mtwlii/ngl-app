import crypto from "node:crypto";

export const correlationId = (req, res, next) => {
  const id = crypto.randomUUID();
  req.correlationId = id;
  res.setHeader("X-Correlation-ID", id);
  next();
};
