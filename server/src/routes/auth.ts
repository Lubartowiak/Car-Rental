import express from "express";
import { register, login } from "../services/auth.service";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export { router as authRouter };
