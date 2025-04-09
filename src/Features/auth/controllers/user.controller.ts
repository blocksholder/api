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
// Extend Express Request to include Multer's file property
interface MulterRequest extends Request {
  file: multer.File;
}
export class UserController {
  // Admin routes


  // GET PROFILE
  static async profile(req: Request, res: Response) {
    try {
      const {id} = req["currentUser"];
      User.findOne({_id: id}).populate('documents').populate('referredUsers')
        .then((response) => {
          return res.status(201).json({
         
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


  static async createProfile(req: Request, res: Response) {
    try {
      const {id} = req["currentUser"];
      const allowedFields = [
        "firstname",
        "lastname",
        "country",
        "phoneNumber"
      ];
      const updates = req.body;

      const user: any = {};
      // Only allow updates for specific fields
      Object.keys(updates).forEach((key) => {
        if (allowedFields.includes(key)) {
          user[key] = updates[key];
        }
      });

      if (!Object.keys(updates).some((item) => allowedFields.includes(item))) {
        return res.status(404).json({
          message: "Required fields empty",
          data: [
            "firstname",
            "lastname",
            "country",
            "phoneNumber"
          ]
        });
      }

      console.log("user :>> ", user);

      User.updateOne({_id: id}, {...user}, {upsert: false})
        .then((result) => {
          console.log("result :>> ", result);
          return res.status(201).json({
         
            message: "User Profile created successfully",
          });
        })
        .catch((error) => {
          return res.status(404).json({
         
            message: "User profile creation failed",
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

  static async updateProfile(req: Request, res: Response) {
    try {
      const {id} = req["currentUser"];
      const allowedFields = [
        "marketNews",
        "investmentNews",
        "marketActivity",
        "phoneNumber",
      ];
      const updates = req.body;

      const user: any = {};
      // Only allow updates for specific fields
      Object.keys(updates).forEach((key) => {
        if (allowedFields.includes(key)) {
          user[key] = updates[key];
        }
      });

      if (!Object.keys(updates).some((item) => allowedFields.includes(item))) {
        return res.status(404).json({
          message: "Required fields empty",
          data: [
            "marketNews",
            "investmentNews",
            "marketActivity",
            "phoneNumber",
          ]
        });
      }

      console.log("user :>> ", user);

      User.updateOne({_id: id}, {...user}, {upsert: false})
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

  static async updateProfileImage(req: MulterRequest, res: Response) {
    try {
      const {id} = req["currentUser"];
      let image = req.file ? `${req.file.fieldname}/${req.file.filename}` : null;
      const user: any = {};
      console.log('image :>> ', image,req.file);
      // Update profile image if provided
      if (image) {
        user.image = image;
      }
      User.updateOne({_id: id}, {...user}, {upsert: false})
        .then((result) => {
          return res.status(201).json({
            message: "User image update success",
            data: image
          });
        })
        .catch((error) => {
          return res.status(404).json({
         
            message: "User image update failed",
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


  static async uploadDocument(req: MulterRequest, res: Response) {
    try {
      const { id } = req["currentUser"];
      let { name, type } = req.body;
      const file = req.file ? req.file.filename : null;
      
      const user = await User.findById(id);
      
      if (!file) {
        res.status(400).json({message:"Required file empty"})
      }

      const newDocument = Document({ file: file, name, type, user:id })

      await newDocument.save()

      user.documents.push(newDocument._id)
      await user.save().then((result) => {
          return res.status(201).json({
         
            message: "File upload success",
            result
          });
        })
        .catch((error) => {
          return res.status(404).json({
         
            message: "File upload failed",
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

  static async deleteDocument(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req["currentUser"].id;

      const document = await Document.findById(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Ensure the document belongs to the user
      if (document.user.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Delete file from server
      const filePath = path.join(__dirname, "../../../public", document.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Remove document from database
      await Document.findByIdAndDelete(id);

      // Remove reference from user
      await User.findByIdAndUpdate(userId, { $pull: { documents: id } });

      return res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
 


   // GET NOTIFICATION
   static async getNotification(req: Request, res: Response) {
    try {
      const {id} = req["currentUser"];
      console.log("id :>> ", id);
      Notification.find()
        .then((response) => {
          return res.status(201).json({
            message: "success",
            response,
          });
        })
        .catch((error) => {
          return res.status(404).json({
            message: "failed",
            other: error,
          });
        });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
   }
  
   static async readNotification(req: Request, res: Response) {
    try {
      const {id} = req.params;

      Notification.updateOne({_id: id}, {status:'READ'}, {upsert: false})
        .then((result) => {
          console.log("result :>> ", result);
          return res.status(201).json({
            message: "success",
          });
        })
        .catch((error) => {
          return res.status(404).json({
            message: "failed",
            other: error,
          });
        });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
  
  static async deleteNotification(req: Request, res: Response) {
    try {
      const {id} = req.params;

      Notification.updateOne({_id: id}, {status:'DELETE'}, {upsert: false})
        .then((result) => {
          console.log("result :>> ", result);
          return res.status(201).json({
            message: "success",
          });
        })
        .catch((error) => {
          return res.status(404).json({
            message: "failed",
            other: error,
          });
        });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }



  // ADD BOOKMARKS

static async addBookmark(req: Request, res: Response) {
  try {
    const { propertyId } = req.body;
    const {id} = req["currentUser"];

    if (!propertyId) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    // Check if the bookmark already exists
    const existingBookmark = await Bookmark.findOne({ user: id, property: propertyId });
    if (existingBookmark) {
      return res.status(200).json({ message: "Property bookmarked successfully", data: existingBookmark });
    }

    // Create new bookmark
    const newBookmark = new Bookmark({ user: id, property: propertyId });
    await newBookmark.save();

    return res.status(201).json({ message: "Property bookmarked successfully", data: newBookmark });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

  // REMOVE BOOKMARKS
  static async removeBookmark(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req["currentUser"].id;
  
      // Find and delete the bookmark
      const deletedBookmark = await Bookmark.findOneAndDelete({ user: userId, property: id });
  
      if (!deletedBookmark) {
        return res.status(404).json({ error: "Bookmark not found" });
      }
  
      return res.status(200).json({ message: "Bookmark removed successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  

    // GET BOOKMARKS
    static async getBookmark(req: Request, res: Response) {
      try {
        const userId = req["currentUser"].id;
    
        const data = await Bookmark.find({ user: userId }).populate('property');
    
        if (!data) {
          return res.status(404).json({ error: "Data not found" });
        }
    
        return res.status(200).json({ message: "Data found successfully", data });
      } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
    


  // ADD SAVED FOR LATER
  static async addSavedForLater(req: Request, res: Response) {
    try {
      const { propertyId } = req.body;
      const {id} = req["currentUser"];
  
      if (!propertyId) {
        return res.status(400).json({ error: "Property ID is required" });
      }
  
      // Check if the savedForLater already exists
      const existingSavedForLater = await SavedForLater.findOne({ user: id, property: propertyId });
      if (existingSavedForLater) {
        return res.status(201).json({ error: "Property already saved" });
      }
  
      // Create new savedForLater
      const newSavedForLater = new SavedForLater({ user: id, property: propertyId });
      await newSavedForLater.save();
  
      return res.status(201).json({ message: "Property saved for later successfully", data: newSavedForLater });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  


    // GET SAVED FOR LATER
    static async getSavedForLater(req: Request, res: Response) {
      try {
        const userId = req["currentUser"].id;
    
        const data = await SavedForLater.find({ user: userId }).populate('property');
    
        if (!data) {
          return res.status(404).json({ error: "Data not found" });
        }
    
        return res.status(200).json({ message: "Data found successfully", data });
      } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
    
     // REMOVE SAVED FOR LATER
  static async removeSavedForLater(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req["currentUser"].id;
    
      // Find and delete the savedForLater
      const deletedSavedForLater = await SavedForLater.findOneAndDelete({ user: userId, property: id });
    
      if (!deletedSavedForLater) {
        return res.status(404).json({ error: "SavedForLater not found" });
      }
    
      return res.status(200).json({ message: "SavedForLater removed successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }

  }

  
  
  }
