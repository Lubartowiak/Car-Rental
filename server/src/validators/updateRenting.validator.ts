import { z } from "zod";
import addRentingSchemma from "./addRenting.validator";
import { Status } from "../entities/enums/Status";

const updateRentingSchemma = addRentingSchemma.extend({
  status: z.nativeEnum(Status),
});

export default updateRentingSchemma;
