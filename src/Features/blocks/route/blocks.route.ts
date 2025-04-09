import * as express from "express";
import {Response, Request} from "express";
import BlockController from "../controllers/blocks.controller";
import {authentication} from "../../../middlewares/authentication.middleware";

const Router = express.Router();

// ----------------------------------------- Blocks ROUTES ---------------------------------------------------


// Get all blocks
Router.get("/", authentication, (req: Request, res: Response) => {
  BlockController.getAllBlocks(req, res);
});

Router.post("/relinquish", authentication, (req: Request, res: Response) => {
  BlockController.relinquishBlock(req, res);
});
Router.post("/transfer", authentication, (req: Request, res: Response) => {
  BlockController.transferBlock(req, res);
});

Router.post("/relinquish/multiple", authentication, (req: Request, res: Response) => {
  BlockController.relinquishMultipleBlocks(req, res);
});
Router.post("/transfer/multiple", authentication, (req: Request, res: Response) => {
  BlockController.transferMultipleBlocks(req, res);
});

export default Router;
