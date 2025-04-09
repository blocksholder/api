import {Request, Response} from "express";
import PaymentDetails from "../schema/payment.schema";

class PaymentController {
  // Create Payment Details
  static async create(req: Request, res: Response) {
    try {
      const {
        type,
        account_name,
        account_number,
        routing_number,
        bank_name,
        check_number,
      } = req.body;
      const user = req["currentUser"].id;

      if (!type || !account_name || !account_number) {
        return res.status(400).json({error: "Missing required fields"});
      }

      if (type === "BANK" && (!routing_number || !bank_name)) {
        return res
          .status(400)
          .json({error: "Bank payments require routing number and bank name"});
      }

      if (type === "CHECK" && !check_number) {
        return res
          .status(400)
          .json({error: "Check payments require a check number"});
      }

      const newPayment = new PaymentDetails({
        user,
        type,
        account_name,
        account_number,
        routing_number,
        bank_name,
        check_number,
      });

      const savedPayment = await newPayment.save();
      return res.status(201).json({message:"Success", data:savedPayment});
    } catch (error) {
      return res.status(500).json({error: "Internal server error"});
    }
  }

  // Get All Payment Details for a User
  static async findAll(req: Request, res: Response) {
    try {
      const user = req["currentUser"].id;
      const payments = await PaymentDetails.find({user, status:{$ne: 'DELETED'}}).sort({createdAt: -1});
      return res.status(200).json({message:"Success", data:payments});
    } catch (error) {
      return res.status(500).json({error: "Internal server error"});
    }
  }

  // Get Single Payment Detail
  static async findById(req: Request, res: Response) {
    try {
      const {id} = req.params;
      const user = req["currentUser"].id;
      const payment = await PaymentDetails.findOne({_id: id, user});

      if (!payment) {
        return res.status(404).json({error: "Payment details not found"});
      }

      return res.status(200).json({message:"Success", data:payment});
    } catch (error) {
      return res.status(500).json({error: "Internal server error"});
    }
  }

  // Update Payment Details
  static async update(req: Request, res: Response) {
    try {
      const {id} = req.params;
      const user = req["currentUser"].id;
      const updates = req.body;

      const updatedPayment = await PaymentDetails.findOneAndUpdate(
        {_id: id, user},
        updates,
        {new: true}
      );

      if (!updatedPayment) {
        return res.status(404).json({error: "Payment details not found"});
      }

      return res.status(200).json({message:"Success", data:updatedPayment});
    } catch (error) {
      return res.status(500).json({error: "Internal server error"});
    }
  }

  // Update Payment Status to "DELETED" Instead of Permanent Deletion
  static async delete(req: Request, res: Response) {
    try {
      const {id} = req.params;
      const user = req["currentUser"].id;

      const updatedPayment = await PaymentDetails.findOneAndUpdate(
        {_id: id, user},
        {status: "DELETED"}, // Update status instead of deleting
        {new: true}
      );

      if (!updatedPayment) {
        return res.status(404).json({error: "Payment details not found"});
      }

      return res
        .status(200)
        .json({message: "Payment details status updated to DELETED"});
    } catch (error) {
      return res.status(500).json({error: "Internal server error"});
    }
  }
}

export default PaymentController;
