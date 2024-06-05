import { Request, Response } from "express";
import registerSchemma from "../validators/register.validator";
import loginSchemma from "../validators/login.validator";
import { buildErrorResponse } from "../utils/buildErrorResponse";
import {
  checkUserExists,
  addNewUser,
  checkPassword,
  findUserByEmail,
} from "./users.service";
import jwt, { Secret } from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
  const parsedBody = registerSchemma.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json(buildErrorResponse(parsedBody.error));
  }

  const { email, password, username } = parsedBody.data;

  if (await checkUserExists(email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  await addNewUser(username, email, password);
  return res.status(201).json({ message: "User registered successfully" });
};

const login = async (req: Request, res: Response) => {
  const parsedBody = loginSchemma.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json(buildErrorResponse(parsedBody.error));
  }

  const { email, password } = parsedBody.data;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "User does not exist" });
  }

  if (!checkPassword(password, user.password)) {
    return res.status(401).json({ message: "Bad password" });
  }

  const token = jwt.sign(
    { username: user.username, userId: user.id },
    process.env.JWT_SECRET as Secret,
    { expiresIn: "1d" }
  );
  res.json({ token });
};

export { register, login };
