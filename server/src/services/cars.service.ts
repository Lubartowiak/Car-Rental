import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import addCarSchemma from "../validators/addCar.validator";
import updateCarSchemma from "../validators/updateCar.validator";
import { Car } from "../entities/car.entity";
import { buildErrorResponse } from "../utils/buildErrorResponse";

const getAllCars = async (req: Request, res: Response) => {
  const carRepository = AppDataSource.getRepository<Car>("Car");
  const cars = await carRepository.find();
  return res.json(cars);
};

const getAllAvailableCars = async (req: Request, res: Response) => {
  const carRepository = AppDataSource.getRepository<Car>("Car");
  const cars = await carRepository.findBy({ available: true });
  return res.json(cars);
};

const addCar = async (req: Request, res: Response) => {
  const parsedBody = addCarSchemma.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json(buildErrorResponse(parsedBody.error));
  }

  const carRepository = AppDataSource.getRepository<Car>("Car");
  const car = carRepository.create(parsedBody.data);
  await carRepository.save(car);
  return res.status(201).json({ message: "Car has been added" });
};

const getCarById = async (req: Request, res: Response) => {
  const parsedId = Number(req.params.id) || -1;
  if (parsedId === -1) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const carRepository = AppDataSource.getRepository<Car>("Car");
  const car = await carRepository.findOneBy({ id: parsedId });
  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }
  return res.json(car);
};

const updateCar = async (req: Request, res: Response) => {
  const parsedBody = updateCarSchemma.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json(buildErrorResponse(parsedBody.error));
  }

  const parsedId = Number(req.params.id) || -1;
  if (parsedId === -1) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const carRepository = AppDataSource.getRepository<Car>("Car");
  const car = await carRepository.findOneBy({ id: parsedId });

  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  carRepository.merge(car, req.body);
  await carRepository.save(car);
  return res.json({ message: "Car has been updated" });
};

const deleteCar = async (req: Request, res: Response) => {
  const carRepository = AppDataSource.getRepository<Car>("Car");
  const car = await carRepository.findOneBy({ id: Number(req.params.id) });

  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  await carRepository.remove(car);
  return res.json({ message: "Car has been deleted" });
};

const checkCarAvailability = async (carId: number) => {
  const carRepository = AppDataSource.getRepository<Car>("Car");
  const car = await carRepository.findOneBy({ id: carId });
  return car?.available;
};

const updateCarAvailability = async (carId: number, available: boolean) => {
  const carRepository = AppDataSource.getRepository<Car>("Car");
  const car = await carRepository.findOneBy({ id: carId });
  if (car) {
    car.available = available;
    await carRepository.save(car);
  }
};

const getCarsRentingHistory = async (req: Request, res: Response) => {
  const carRepository = AppDataSource.getRepository<Car>("Car");
  const history = await carRepository.find({
    relations: {
      rentings: true,
    },
  });
  return res.json(history);
};

export {
  getAllCars,
  getAllAvailableCars,
  addCar,
  getCarById,
  updateCar,
  deleteCar,
  updateCarAvailability,
  checkCarAvailability,
  getCarsRentingHistory,
};
