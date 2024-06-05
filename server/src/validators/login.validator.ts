import { z } from "zod";

const registerSchemma = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default registerSchemma;
