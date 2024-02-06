import express from "express";
const router = express.Router();
import { register, login,Attendance} from "../Controller/authController.js";



router.post("/register", register);
router.post("/login", login);
router.post("/Attendance", Attendance)

export default router;



