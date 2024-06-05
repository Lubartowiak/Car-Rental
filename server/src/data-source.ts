import { DataSource } from "typeorm";
import { Car } from "./entities/car.entity";
import { User } from "./entities/user.entity";
import { Renting } from "./entities/renting.entity";

const AppDataSource = new DataSource({
  type: "mysql",
  host: "mysql",
  port: 3306,
  username: "admin",
  password: "admin",
  database: "car_rental",
  synchronize: true,
  logging: false,
  entities: [Car, User, Renting],
  subscribers: [],
  migrations: [],
});

const connection = async () => {
  let retries = 0;
  const maxRetries = 5;

  const connect = async (): Promise<void> => {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
    } catch (e) {
      retries++;
      if (retries < maxRetries) {
        await new Promise((res) => setTimeout(res, 5000));
        return connect();
      } else {
        console.log("Reached max retries");
        throw e;
      }
    }
  };

  return connect();
};

export default connection;
export { AppDataSource };
