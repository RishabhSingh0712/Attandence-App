import express from "express";
const router = express.Router();
import { register, login, attendance,getAllUsersAttendance, fetchUserInfo } from "../Controller/authController.js";

router.post("/register", register);
router.post("/login", login);
router.post("/attendance", attendance);
router.get("/allAttendance", getAllUsersAttendance);
router.post("/fetchUserInfo", fetchUserInfo);

export default router;
