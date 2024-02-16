import express from "express";
import { register, Login } from "../Controller/auth.js";

const router = express.Router();

router.post("/signup", register);
router.post("/login", Login);

export default router;