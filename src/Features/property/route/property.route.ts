import * as express from "express";
import {Response, Request} from "express";
import * as multer from "multer";
import {PropertyController} from "../controllers/property.controller";
import {upload} from "../../../helpers/uploader";
import { authentication } from "../../../middlewares/authentication.middleware";
const Router = express.Router();

interface MulterRequest extends Request {
  file: multer.File;
}

// ----------------------------------------- Property ROUTES ---------------------------------------------------
// CREATE PROPERTY
Router.post("/",
  authentication,
    upload.single("property_image"),
    (req: MulterRequest, res: Response) => {
  PropertyController.create(req, res);
});

// LIST PROPERTY
Router.get("/",
  // authentication,
  (req: Request, res: Response) => {
  PropertyController.findAll(req, res);
});

// SINGLE PROPERTY
Router.get("/:id",
  authentication,(req: Request, res: Response) => {
  PropertyController.findById(req, res);
});

// UPDATE PROPERTY
Router.patch("/:id",
    upload.single("property_image"),
    (req: MulterRequest, res: Response) => {
  PropertyController.findAndUpdate(req, res);
});

// ADD PROPERTY IMAGE
Router.post(
  "/image/:id",
  authentication,
  // authorization(AdminModel,[Roles.ADMIN, Roles.USER],[Permission.ALL,Permission.UNIVERSITY_PROGRAMS]),
  upload.single("property_image"),
  (req: MulterRequest, res: Response) => {
    PropertyController.addImage(req, res);
  }
);

// ADD PROPERTY DOCUMENT
Router.post(
  "/document/:id",
  authentication,
  // authorization(AdminModel,[Roles.ADMIN, Roles.USER],[Permission.ALL,Permission.UNIVERSITY_PROGRAMS]),
  upload.single("property_document"),
  (req: MulterRequest, res: Response) => {
    PropertyController.addDocument(req, res);
  }
);

// DELETE PROPERTY
Router.delete("/:id", (req: Request, res: Response) => {
  PropertyController.delete(req, res);
});


// DELETE PROPERTY DOCUMENT
Router.delete("/image/:id", (req: Request, res: Response) => {
    PropertyController.deleteImage(req, res);
});
  
// DELETE PROPERTY IMAGE
Router.delete("/document/:id", (req: Request, res: Response) => {
    PropertyController.deleteDocument(req, res);
  });

export default Router;
