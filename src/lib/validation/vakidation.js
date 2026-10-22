//function
// get 2 params
// DTO vs Body
import * as z from "zod";
import { AppError } from "../../pkg/error/error.js";

export function validateBody(dto, body) {
  const result = dto.safeParse(body);
  if (!result.success) {
    const errMessage = result.error.issues.map(
      (issue) => `${issue.path[0]??'Error'}: ${issue.message}`,
    );
    throw new AppError(errMessage.join(", "), 400);
  }
  return result.data;
}
