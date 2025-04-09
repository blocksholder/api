import * as express from "express"; 
import path = require("path");

import userRoutes from "../Features/auth/route/user.routes";
import authRoutes from "../Features/auth/route/auth.routes";
import propertyRoutes from '../Features/property/route/property.route';
import callbackRoutes from '../Features/callback/route/callback.route';
import paymentDetailsRoutes from '../Features/paymentDetails/route/payment.route';
import withdrawalRequestRoutes from '../Features/withdrawals/route/withdrawals.route';
import depositRoutes from '../Features/deposits/route/deposits.route';
import investmentAccountRoutes from '../Features/investmentAccount/route/investmentAccount.route';
import blockRoutes from '../Features/blocks/route/blocks.route';
import purchaseOrderRoutes from '../Features/purchaseOrder/route/purchaseOrder.route';
import analyticsRoutes from '../Features/analytics/route/analytics.route';

const Router = express.Router();

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Authentication routes
 */
Router.use("/auth", authRoutes);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: User routes
 */
Router.use("/users", userRoutes);

Router.use("/property", propertyRoutes);
 
Router.use('/callback', callbackRoutes)

Router.use('/payment-details', paymentDetailsRoutes)

Router.use('/withdrawal-request', withdrawalRequestRoutes)

Router.use('/deposit', depositRoutes)

Router.use('/investment-account', investmentAccountRoutes)

Router.use("/purchase-order", purchaseOrderRoutes);

Router.use("/blocks", blockRoutes);

Router.use('/analytics', analyticsRoutes)


export { Router }