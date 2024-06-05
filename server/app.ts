import express from "express";
import "reflect-metadata";
import connection from "./src/data-source";
import { carsRouter } from "./src/routes/cars";
import { rentingsRouter } from "./src/routes/rentings";
import { authRouter } from "./src/routes/auth";
import bodyParser from "body-parser";
import verifyToken from "./src/middlewares/auth.middleware";
import "dotenv/config";
import cors from "cors";

const app = express();

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Data Source has been initialized!");
//   })
//   .catch((err) => {
//     console.error("Error during Data Source initialization:", err);
//   });
connection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/cars", verifyToken, carsRouter);
app.use("/rentings", verifyToken, rentingsRouter);
app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log("Server running at PORT: ", 3000);
});
