import * as express from "express";
import { WithdrawalsController } from "../controllers/withdrawals.controller";
import { authentication } from "../../../middlewares/authentication.middleware";

const Router = express.Router();

// CREATE WITHDRAWAL REQUEST
Router.post("/", authentication, (req, res) => {
  WithdrawalsController.create(req, res);
});

// UPDATE STATUS OF WITHDRAWAL REQUEST
Router.patch("/status/:id", authentication, (req, res) => {
  WithdrawalsController.updateStatus(req, res);
});

// DELETE WITHDRAWAL REQUEST
Router.delete("/:id", authentication, (req, res) => {
  WithdrawalsController.delete(req, res);
});

// GET ALL WITHDRAWAL REQUESTS FOR A USER
Router.get("/", authentication, (req, res) => {
  WithdrawalsController.findAll(req, res);
});

// GET SINGLE WITHDRAWAL REQUEST
Router.get("/:id", authentication, (req, res) => {
  WithdrawalsController.findById(req, res);
});

export default Router;
