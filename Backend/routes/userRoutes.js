import express from "express";
const router = express.Router();
import { register, login, attendance } from "../Controller/authController.js";

router.post("/register", register);
router.post("/login", login);
router.post("/attendance", attendance);

export default router;
