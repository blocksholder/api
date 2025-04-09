import * as express from "express";
import {Response, Request} from "express";
import CallbackController from "../controllers/callback.controller";
import { authentication } from "../../../middlewares/authentication.middleware";
const Router = express.Router();

// ----------------------------------------- Callback ROUTES ---------------------------------------------------

// Create Callback Request
Router.post("/",
    authentication,
    (req: Request, res: Response) => {
  CallbackController.create(req,res);
});

// Get All Callback Requests
Router.get("/", authentication,(req: Request, res: Response) => {
  CallbackController.findAll(req,res);
});

// Get All Callback Requests
Router.get("/", (req: Request, res: Response) => {
  CallbackController.findAllAdmin(req,res);
});

// Get Single Callback Request
Router.get("/:id", (req: Request, res: Response) => {
  CallbackController.findById(req,res);
});

// Update Callback Request Status
Router.patch("/:id", (req: Request, res: Response) => {
  CallbackController.updateStatus(req,res);
});

// Delete Callback Request
Router.delete("/:id", (req: Request, res: Response) => {
  CallbackController.delete(req,res);
});

export default Router;
