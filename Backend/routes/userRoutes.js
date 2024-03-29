import express from "express";
const router = express.Router();
import { register, login, attendance,getAllUsersAttendance, fetchUserInfo,forgetPassword } from "../Controller/authController.js";

router.post("/register", register);
router.post("/login", login);
router.post("/attendance", attendance);
router.get("/allAttendance", getAllUsersAttendance);
router.post("/fetchUserInfo", fetchUserInfo);
router.post("/ForgetPassword", forgetPassword);

export default router;
