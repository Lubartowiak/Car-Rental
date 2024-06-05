import addCarSchemma from "./addCar.validator";
import { z } from "zod";

const updateCarSchemma = addCarSchemma.extend({
  available: z.boolean(),
});

export default updateCarSchemma;
