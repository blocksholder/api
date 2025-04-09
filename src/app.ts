
import { Express, Request, Response } from "express"
import * as express from 'express';
import * as bodyParser from "body-parser";
import { Router } from "./routes/all.routes";
import "reflect-metadata";
import * as dotenv from 'dotenv';
import { errorHandler } from "./middlewares/errorHandler.middleware";
import * as cors from 'cors';
import path = require("path");
import connectToDatabase from "./database/data-source";
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); 


dotenv.config();
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(errorHandler)
app.use(Router)


app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req: Request, res: Response) => { 
    res.json({
        message: 'Welcome to BlockHolder API'
    })
})



connectToDatabase().then(() => { 
    app.listen(process.env.PORT, ()=> console.log(`Server running on port:${process.env.PORT}`))
}).catch((error) => {
    console.log('error :>> ', error);
})
