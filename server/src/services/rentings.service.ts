import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import addRentingSchemma from "../validators/addRenting.validator";
import updateRentingSchemma from "../validators/updateRenting.validator";
import { Renting } from "../entities/renting.entity";
import { buildErrorResponse } from "../utils/buildErrorResponse";
import { updateCarAvailability, checkCarAvailability } from "./cars.service";
import { Car } from "../entities/car.entity";

const getAllRentings = async (req: Request, res: Response) => {
  const rentingsRepository = AppDataSource.getRepository<Renting>("Renting");
  const rentings = await rentingsRepository.find({
    relations: {
      car: true,
    },
    select: {
      car: {
        id: true,
        manufacturer: true,
        model: true,
      },
    },
  });
  return res.json(rentings);
};

const addRenting = async (req: Request, res: Response) => {
  const parsedBody = addRentingSchemma.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json(buildErrorResponse(parsedBody.error));
  }

  if (!(await checkCarAvailability(parsedBody.data.carId))) {
    return res.status(400).json({ message: "Car is not available" });
  }

  const rentingsRepository = AppDataSource.getRepository<Renting>("Renting");
  const car = await AppDataSource.getRepository<Car>("Car").findOneBy({
    id: parsedBody.data.carId,
  });

  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  const renting = new Renting();
  renting.car = car;
  renting.startDate = parsedBody.data.startDate;
  renting.endDate = parsedBody.data.endDate;
  await rentingsRepository.save(renting);
  await updateCarAvailability(parsedBody.data.carId, false);
  return res.status(201).json({ message: "Renting has been added" });
};

const getRentingById = async (req: Request, res: Response) => {
  const parsedId = Number(req.params.id) || -1;
  if (parsedId === -1) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const rentingsRepository = AppDataSource.getRepository<Renting>("Renting");
  const renting = await rentingsRepository.findOne({
    relations: {
      car: true,
    },
    select: {
      car: {
        id: true,
      },
    },
    where: { id: parsedId },
  });
  if (!renting) {
    return res.status(404).json({ message: "Renting not found" });
  }
  return res.json(renting);
};

const updateRenting = async (req: Request, res: Response) => {
  const parsedBody = updateRentingSchemma.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json(buildErrorResponse(parsedBody.error));
  }

  const parsedId = Number(req.params.id) || -1;
  if (parsedId === -1) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const rentingsRepository = AppDataSource.getRepository<Renting>("Renting");
  const renting = await rentingsRepository.findOne({
    relations: ["car"],
    where: { id: parsedId },
  });

  if (!renting) {
    return res.status(404).json({ message: "Renting not found" });
  }

  const car = await AppDataSource.getRepository<Car>("Car").findOneBy({
    id: parsedBody.data.carId,
  });

  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  if (renting.car.id !== car.id) {
    if (parsedBody.data.status === "returned") {
      return res
        .status(400)
        .json({ message: "You can't return a car that is not rented" });
    }
    if (renting.status === "returned") {
      return res
        .status(400)
        .json({ message: "You can't change the car of a returned renting" });
    }
    await updateCarAvailability(renting.car.id, true);
    await updateCarAvailability(car.id, false);
  }

  renting.car = car;
  renting.startDate = parsedBody.data.startDate;
  renting.endDate = parsedBody.data.endDate;
  renting.status = parsedBody.data.status;
  await rentingsRepository.save(renting);
  if (renting.status === "returned") {
    await updateCarAvailability(renting.car.id, true);
  }
  return res.json({ message: "Renting has been updated" });
};

const deleteRenting = async (req: Request, res: Response) => {
  const rentingsRepository = AppDataSource.getRepository<Renting>("Renting");
  const renting = await rentingsRepository.findOne({
    relations: ["car"],
    where: { id: Number(req.params.id) },
  });
  if (!renting) {
    return res.status(404).json({ message: "Renting not found" });
  }
  await updateCarAvailability(renting.car.id, true);
  await rentingsRepository.remove(renting);
  return res.json({ message: "Renting has been deleted" });
};

export {
  getAllRentings,
  addRenting,
  getRentingById,
  updateRenting,
  deleteRenting,
};
