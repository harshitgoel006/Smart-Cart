import {Router} from 'express';
import { registerUser, sendOtp } from '../controllers/user.controller.js';
import{upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();



router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/send-otp").post(sendOtp);


export default router;