import {Request, Response} from "express";
import {encrypt} from "../../../helpers/tokenizer";
import {Roles} from "../enums/roles.enum";
import {UserResponse} from "../dto/user.dto";
import {Status} from "../enums/status.enum";
import {randomInt} from "crypto";
import {sendMail} from "../../../helpers/emailer";
import User from "../schema/user.schema";
import getRandomInt from "../../../helpers/random";
import OtpModel from "../schema/otp.schema";
import {isOtpExpired} from "../../../helpers/isOtpExpired";

export class AuthController {
 
  // OTP-LOGIN-REGISTER
  static async sendOtp(req: Request, res: Response) {
    try {
      res.status(200).json({message: "Your otp has been sent successfull"});
    } catch (error) {
      return res.status(500).json({message: "Internal server error"});
    }
  }

  // OTP-LOGIN-REGISTER
  static async verifyOtp(req: Request, res: Response) {
    try {
      let {otp, email} = req.body;
      OtpModel.findOneAndUpdate(
        {otp, email, status: "ACTIVE"},
        {$set: {status: "DEACTIVE"}},
        {new: true, runValidators: true}
      )
        .then((data) => {
          console.log("data :>> ", data);
          if (data) {
            console.log(
              "(isOtpExpired(data.createdAt) :>> ",
              isOtpExpired(data.createdAt)
            );
            if (isOtpExpired(data.createdAt)) {
              return res.status(400).json({ message: "Otp expired" });
            
            } else {
              User.findOneAndUpdate(
                { email }, // Search condition
                { email, role: 'USER', verified: false, otp, status: "ACTIVE" }, // Update or create new
                { upsert: true, new: true, setDefaultsOnInsert: true } // Create if not found
              ).populate('documents')
                .then((user) => {
                  user = user._doc
                  const token = encrypt.generateToken({
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    role: user.role
                  });
                  console.log('exit user :>> ', user);
                  res.status(200)
                    .json({
                      message: "Success",
                      response: {token,...user}
                    });
                }).catch((e) => {

                  res.status(400).json({ message: "Please try again" });
                })
            }

            } else {
              res.status(400).json({ message: "Invalid otp" });
            }
         
        })
        .catch((e) => {
          res.status(400).json({message: "Invalid otp"});
        });
    } catch (error) {
      return res.status(500).json({message: "Internal server error"});
    }
  }
}
