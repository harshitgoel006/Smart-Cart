import {Router} from 'express';
import { registerUser, sendOtp, verifyOtp } from '../controllers/user.controller.js';
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
router.route("/verify-otp").post(verifyOtp)


export default router;