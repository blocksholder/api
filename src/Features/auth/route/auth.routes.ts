import * as express from "express"; 
import {Response, Request} from "express"; 
import * as multer from 'multer';
import path = require("path");
import { Roles } from "../enums/roles.enum";
import { AuthController } from "../controllers/auth.controller";
import { authentication } from "../../../middlewares/authentication.middleware";
import { Notification } from "../enums/notification.enum";
import { upload } from "../../../helpers/uploader";
import { sendOtp } from "../../../middlewares/sendOtp.middleware";


const Router = express.Router();

// ----------------------------------------- USER ROUTES ---------------------------------------------------
//
// SEND OTP
Router.post("/send-otp",
    sendOtp,
    (req: Request, res: Response) => { 
        AuthController.sendOtp(req,res)
    }
);

// VERIFY OTP
Router.post("/verify-otp",
    (req: Request, res: Response) => { 
        AuthController.verifyOtp(req,res)
    }
);

export default Router;