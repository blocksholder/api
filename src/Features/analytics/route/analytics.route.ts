import * as express from "express";
import {Response, Request} from "express";
import {AnalyticsController} from "../controllers/analytics.controller";
import {authentication} from "../../../middlewares/authentication.middleware";
const Router = express.Router();

// ----------------------------------------- Analytics ROUTES ---------------------------------------------------
// 1. Portfolio value,
// 2. Monthly income,
// 3. Total income,
// 4. Cash balance,
// 5. Total properties,
// 6. Total bloks owned,
// 7. Annual revenue
Router.get("/portfolio", authentication, (req: Request, res: Response) => {
  AnalyticsController.getPortfolio(req, res);
});

// 1. Total investment balance,
// 2. Cash balance
Router.get("/wallet", authentication, (req: Request, res: Response) => {
  AnalyticsController.getWallet(req, res);
});


// ADMIN ONLY  

Router.patch(
    "/:id",
    authentication,
    (req: Request, res: Response) => {
      AnalyticsController.update(req, res);
    }
);
  
Router.post(
    "/",
    authentication,
    (req: Request, res: Response) => {
      AnalyticsController.add(req, res);
    }
);
  

Router.delete(
    "/:id",
    authentication,
    (req: Request, res: Response) => {
      AnalyticsController.delete(req, res);
    }
);

Router.get(
    "/",
    authentication,
    (req: Request, res: Response) => {
      AnalyticsController.getAll(req, res);
    }
);


Router.get(
    "/year",
    authentication,
    (req: Request, res: Response) => {
      AnalyticsController.getByYear(req, res);
    }
);

Router.get(
    "/:id",
    authentication,
    (req: Request, res: Response) => {
      AnalyticsController.getOne(req, res);
    }
);

export default Router;
