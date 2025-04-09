import * as express from "express"; 
import {Response, Request} from "express"; 
import { UserController } from "../controllers/user.controller";
import { Notification } from "../enums/notification.enum";
import { Roles } from "../enums/roles.enum";
import path = require("path");
import multer from "multer";
import { upload } from "../../../helpers/uploader";
import { authentication } from "../../../middlewares/authentication.middleware";
import { authorization } from "../../../middlewares/authorization.middleware";

// Extend Express Request to include Multer's file property
interface MulterRequest extends Request {
  file: multer.File;
}

const Router = express.Router();
 



Router.patch("/update-user",
    authentication,
    (req: Request, res: Response) => { 
        UserController.updateProfile(req,res)
    }
);

Router.patch("/create-profile",
    authentication,
    (req: Request, res: Response) => { 
        UserController.createProfile(req,res)
    }
);



// GET PROFILE
Router.get("/profile",
    authentication,
    (req: Request, res: Response) => { 
       UserController.profile(req,res)
    }
);


// UPDATE PROFILE IMAGE
Router.patch("/update-image",
    authentication,
    upload.single("user"),
    (req: MulterRequest, res: Response) => { 
       UserController.updateProfileImage(req,res)
    }
);




// UPLOAD DOCUMENTS
Router.patch("/document",
    authentication,
    upload.single("user_document"),
    (req: MulterRequest, res: Response) => { 
       UserController.uploadDocument(req,res)
    }
);


// DELETE PROPERTY IMAGE
Router.delete("/document/:id",
    authentication,
    (req: Request, res: Response) => {
        UserController.deleteDocument(req, res);
  });

  

// ALL NOTIFICATION
Router.get("/notification",
    authentication,
    (req: Request, res: Response) => { 
       UserController.getNotification(req,res)
    }
);



// READ NOTIFICATION
Router.patch("/notification/read",
    authentication,
    (req: Request, res: Response) => { 
       UserController.readNotification(req,res)
    }
);


// DELETE NOTIFICATION
Router.delete("/notification",
    authentication,
    (req: Request, res: Response) => { 
       UserController.deleteNotification(req,res)
    }
);


// ADD BOOKMARK
Router.post("/bookmark",
    authentication,
    (req: Request, res: Response) => { 
       UserController.addBookmark(req,res)
    }
);

// GET BOOKMARK
Router.get("/bookmark",
    authentication,
    (req: Request, res: Response) => { 
       UserController.getBookmark(req,res)
    }
);

// REMOVE BOOKMARK
Router.delete("/bookmark/:id",
    authentication,
    (req: Request, res: Response) => { 
       UserController.removeBookmark(req,res)
    }
);


// ADD SAVEDFORLATER
Router.post("/saved-for-later",
    authentication,
    (req: Request, res: Response) => { 
       UserController.addSavedForLater(req,res)
    }
);

// ADD SAVEDFORLATER
Router.get("/saved-for-later",
    authentication,
    (req: Request, res: Response) => { 
       UserController.getSavedForLater(req,res)
    }
);

// REMOVE BOOKMARK
Router.delete("/saved-for-later/:id",
    authentication,
    (req: Request, res: Response) => { 
       UserController.removeSavedForLater(req,res)
    }
);



export default Router;