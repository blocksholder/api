import * as express from "express";
import {Response, Request} from "express";
import InvestmentAccountController from "../controllers/investmentAccount.controller";
import {authentication} from "../../../middlewares/authentication.middleware";
import {upload} from "../../../helpers/uploader";
import * as multer from "multer";
import { RequestWithUser } from "../../../types/request-with-user";

interface MulterRequest extends RequestWithUser {
  files?: Express.Multer.File[];
}

const Router = express.Router();

// Create Investment Account
Router.post(
  "/",
  authentication,
  upload.array("investment_documents"),
  (req: any, res: Response) => {
    InvestmentAccountController.create(req, res);
  }
);

// Create Investment Account
Router.post(
  "/personal",
  authentication,
  (req: RequestWithUser, res: Response) => {
    InvestmentAccountController.createPersonal(req as any, res);
  }
);

// Get All Investment Accounts
Router.get("/", authentication, (req: RequestWithUser, res: Response) => {
  InvestmentAccountController.getAll(req as any, res);
});

// Get All Investment Accounts
Router.get("/admin", authentication, (req: RequestWithUser, res: Response) => {
  InvestmentAccountController.getAllAdmin(req as any, res);
});

// Get Single Investment Account
Router.get("/:id", authentication, (req: RequestWithUser, res: Response) => {
  InvestmentAccountController.getById(req as any, res);
});

// Update Investment Account Status
Router.patch("/:id", authentication, (req: RequestWithUser, res: Response) => {
  InvestmentAccountController.updateStatus(req as any, res);
});

// Delete Investment Account
Router.delete("/:id", authentication, (req: RequestWithUser, res: Response) => {
  InvestmentAccountController.delete(req as any, res);
});

export default Router;
