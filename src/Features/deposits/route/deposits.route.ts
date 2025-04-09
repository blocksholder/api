import * as express from "express";
import { Request, Response } from "express";
import { authentication } from "../../../middlewares/authentication.middleware";
import DepositController from "../controllers/deposits.controller";


const Router = express.Router();

// CREATE Deposit
Router.post("/", authentication, (req: Request, res: Response) => {
  DepositController.create(req, res);
});

// GET all Deposits
Router.get("/", authentication, (req: Request, res: Response) => {
  DepositController.findAll(req, res);
});

// GET a single Deposit
Router.get("/:id", authentication, (req: Request, res: Response) => {
  DepositController.findById(req, res);
});

// UPDATE Deposit Status
Router.patch("/callback", (req: Request, res: Response) => {
  DepositController.updateCallback(req, res);
});

// DELETE Deposit
Router.delete("/:id", authentication, (req: Request, res: Response) => {
  DepositController.delete(req, res);
});

export default Router;
