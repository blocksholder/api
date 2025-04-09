import * as express from "express";
import {Response, Request} from "express";
import PurchaseOrderController from "../controllers/purchaseOrder.controller";
import { authentication } from "../../../middlewares/authentication.middleware";

const Router = express.Router();

Router.post("/create",
    authentication,
    (req: Request, res: Response) => { 
    PurchaseOrderController.createPurchaseOrder(req,res)
});


Router.get("/",
    authentication,
    (req: Request, res: Response) => { 
    PurchaseOrderController.getAllPurchaseOrders(req,res)
});




export default Router;