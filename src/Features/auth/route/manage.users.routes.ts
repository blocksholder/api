import * as express from "express"; 
import {Response, Request} from "express"; 
import { authentication } from "../../../middlewares/authentication.middleware";
import { ManageUsersController } from "../controllers/manage.users.controller";


const Router = express.Router();

// ----------------------------------------- MANAGE USERS ROUTES ---------------------------------------------------
//
// ALL USERS
Router.get("/users",
    authentication,
    (req: Request, res: Response) => { 
        ManageUsersController.findAll(req,res)
    }
);


// SINGLE USER
Router.get("/users/:id",
    authentication,
    (req: Request, res: Response) => { 
        ManageUsersController.findOne(req,res)
    }
);

// UPDATE USER
Router.patch("/users/:id",
    authentication,
    (req: Request, res: Response) => { 
        ManageUsersController.updateUser(req,res)
    }
);

export default Router;