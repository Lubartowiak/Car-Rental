import express from "express";
import {
  getAllCars,
  getAllAvailableCars,
  addCar,
  getCarById,
  updateCar,
  deleteCar,
  getCarsRentingHistory,
} from "../services/cars.service";

const router = express.Router();

router.get("/", getAllCars);
router.get("/available", getAllAvailableCars);
router.get("/rentings", getCarsRentingHistory);
router.post("/", addCar);
router.get("/:id", getCarById);
router.put("/:id", updateCar);
router.delete("/:id", deleteCar);

export { router as carsRouter };
