import * as express from "express";
import { Request, Response } from "express";
import { authentication } from "../../../middlewares/authentication.middleware";
import PaymentController from "../controllers/payment.controller";


const Router = express.Router();

// ADD PAYMENT DETAILS
Router.post("/", authentication, (req: Request, res: Response) => {
  PaymentController.create(req, res);
});

// GET ALL PAYMENT DETAILS FOR A USER
Router.get("/", authentication, (req: Request, res: Response) => {
  PaymentController.findAll(req, res);
});

// GET SINGLE PAYMENT DETAIL
Router.get("/:id", authentication, (req: Request, res: Response) => {
  PaymentController.findById(req, res);
});

// UPDATE PAYMENT DETAILS
Router.patch("/:id", authentication, (req: Request, res: Response) => {
  PaymentController.update(req, res);
});

// DELETE PAYMENT DETAILS
Router.delete("/:id", authentication, (req: Request, res: Response) => {
  PaymentController.delete(req, res);
});

export default Router;
