import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export const buildErrorResponse = (parsedBody: ZodError) => {
  let errors: { [key: string]: string } = {};
  fromZodError(parsedBody).details.forEach((error) => {
    errors[error.path.join("")] = error.message;
  });
  return errors;
};
