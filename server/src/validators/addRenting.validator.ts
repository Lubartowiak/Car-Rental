import { z } from "zod";

const addRentingSchemma = z.object({
  carId: z.number().int().positive(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export default addRentingSchemma;
