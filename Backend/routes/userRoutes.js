import  express  from 'express';
const router = express.Router();
import UserController from "../Controller/UserController.js";

router.post ('/register',UserController.userRegistration)

export default router