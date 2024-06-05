import express from "express";
import {
  getAllRentings,
  addRenting,
  getRentingById,
  updateRenting,
  deleteRenting,
} from "../services/rentings.service";

const router = express.Router();

router.get("/", getAllRentings);
router.post("/", addRenting);
router.get("/:id", getRentingById);
router.put("/:id", updateRenting);
router.delete("/:id", deleteRenting);

export { router as rentingsRouter };
