import * as express from "express";
import {Response, Request} from "express";
import InvestmentAccountController from "../controllers/investmentAccount.controller";
import {authentication} from "../../../middlewares/authentication.middleware";
import {upload} from "../../../helpers/uploader";
import * as multer from "multer";

interface MulterRequest extends Request {
  files?: multer.File[];
}

const Router = express.Router();

// Create Investment Account
Router.post(
  "/",
  authentication,
  upload.array("investment_documents"),
  (req: MulterRequest, res: Response) => {
    InvestmentAccountController.create(req, res);
  }
);

// Create Investment Account
Router.post(
  "/personal",
  authentication,
  (req: Request, res: Response) => {
    InvestmentAccountController.createPersonal(req, res);
  }
);

// Get All Investment Accounts
Router.get("/", authentication, (req: Request, res: Response) => {
  InvestmentAccountController.getAll(req, res);
});

// Get All Investment Accounts
Router.get("/admin", authentication, (req: Request, res: Response) => {
  InvestmentAccountController.getAllAdmin(req, res);
});

// Get Single Investment Account
Router.get("/:id", authentication, (req: Request, res: Response) => {
  InvestmentAccountController.getById(req, res);
});

// Update Investment Account Status
Router.patch("/:id", authentication, (req: Request, res: Response) => {
  InvestmentAccountController.updateStatus(req, res);
});

// Delete Investment Account
Router.delete("/:id", authentication, (req: Request, res: Response) => {
  InvestmentAccountController.delete(req, res);
});

export default Router;
