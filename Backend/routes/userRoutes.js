import express from "express";
const router = express.Router();
import { register, login, attendance,getAllUsersAttendance } from "../Controller/authController.js";

router.post("/register", register);
router.post("/login", login);
router.post("/attendance", attendance);
router.get("/api/user/allAttendance", getAllUsersAttendance);

export default router;
