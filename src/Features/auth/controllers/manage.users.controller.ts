import {Request, Response} from "express";
import {UserResponse} from "../dto/user.dto";
import {Status} from "../enums/status.enum";
import multer from "multer";
import User from "../schema/user.schema";
import {encrypt} from "../../../helpers/tokenizer";
import Document from "../schema/document.schema";
import Notification from "../schema/notification.schema";
import Bookmark from "../schema/bookmark.schema";
import SavedForLater from "../schema/saveForLater.schema";
import * as path from "path";
import * as fs from "fs";
import InvestmentAccount from "../../investmentAccount/schema/investmentAccount.schema";
// Extend Express Request to include Multer's file property
interface MulterRequest extends Request {
  file: multer.File;
}
export class ManageUsersController {
    // Admin routes


    // GET ALL USERS
    static async findAll(req: Request, res: Response) {
        try {
           
            User.find()
                .then((response) => {
                    return res.status(200).json({
         
                        message: "Users success",
                        response,
                    });
                })
                .catch((error) => {
                    return res.status(404).json({
         
                        message: "Users failed",
                        other: error,
                    });
                });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

      // GET ALL USERS
      static async findOne(req: Request, res: Response) {
        try {
           
            User.findById(req.params.id).populate('documents')
                .then((response) => {
                    return res.status(200).json({
         
                        message: "User success",
                        response,
                    });
                })
                .catch((error) => {
                    return res.status(404).json({
         
                        message: "User failed",
                        other: error,
                    });
                });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }


     static async updateUser(req: Request, res: Response) {
        try {
          
            const id = req.params.id;
          const data = req.body;

          const userData = await User.findById(id);
          console.log('userData :>> ', userData);
          if (!userData) {
            return res.status(404).json({message:"Account not found"});
          }
          else if (data.verified == true && !userData.verified) {
             await InvestmentAccount.create({ user:id, status:'VERIFIED', accountName:`${userData.firstname} ${userData.lastname}`});
          }
    
          
    
    
    
          User.updateOne({_id: id}, {...data}, {upsert: false})
            .then((result) => {
              console.log("result :>> ", result);
              return res.status(201).json({
                message: "User update success",
              });
            })
            .catch((error) => {
              return res.status(404).json({
                message: "User update failed",
                other: error,
              });
            });
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
          });
        }
      }
}