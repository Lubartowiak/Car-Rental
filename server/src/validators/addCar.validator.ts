import { z } from "zod";
import { FuelType } from "../entities/enums/FuelType";
import { BodyType } from "../entities/enums/BodyType";
export const addCarSchemma = z.object({
  manufacturer: z.string().min(1).max(30),
  model: z.string().min(1).max(30),
  volume: z.number().min(0.0).max(10.0),
  year: z.string().length(4),
  fuel: z.nativeEnum(FuelType),
  body: z.nativeEnum(BodyType),
});

export default addCarSchemma;
