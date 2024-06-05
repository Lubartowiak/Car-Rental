import { z } from "zod";

const registerSchemma = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(
      new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$"
      ),
      {
        message:
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
      }
    ),
  username: z.string().refine((name) => name.trim().length > 0),
});

export default registerSchemma;
