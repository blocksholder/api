import {NextFunction, Request, Response} from "express";
import * as dotenv from "dotenv";
import {randomUUID} from "crypto";
import {sendMail} from "../helpers/emailer";
import OtpModel from "../Features/auth/schema/otp.schema";
import User from "../Features/auth/schema/user.schema";
import {Status} from "../enums/status.enum";
dotenv.config();

export const sendOtp = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  try {
    const {email} = req.body;
    if (!email) {
      return res.status(400).json({message: "Email is required"});
    }

    console.log("Received request for OTP: ", email);

    const otp = randomUUID().replace(/\D/g, "").substring(0, 6); // Generate a 6-digit OTP
    console.log("Generated OTP: ", otp);

    // Store OTP in the database
    const otpResponse = OtpModel({
      email,
      otp,
    });
    otpResponse
      .save()
        .then((user) => {
          console.log('user :>> ', user);
        // Send email with OTP
        sendMail(
          email,
          "",
          "Verify Your Email Address to Gain Access to Our Service",
          "otpHtml", // Email template (assuming this exists)
          otp
        );
          
        return res.status(200).json({message: "OTP sent successfully"});
        })
      
      .catch((e) => {
        console.log('e :>> ', e);
        return res.status(404).json({
          message: "Please try again",
        });
      });

    console.log("OTP stored: ", otpResponse);

   
  } catch (error) {
    console.error("Error sending OTP: ", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
