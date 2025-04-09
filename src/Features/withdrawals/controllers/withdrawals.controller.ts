import { Request, Response } from "express";
import WithdrawalRequest from "../schema/withdrawals.schema";


export class WithdrawalsController {
  // CREATE A WITHDRAWAL REQUEST
  static async create(req: Request, res: Response) {
    try {
      const { paymentDetails, investmentAccount, amount, lastBalance } = req.body;
      const user = req["currentUser"].id;

      if (!paymentDetails || !investmentAccount || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newRequest = new WithdrawalRequest({
        user,
        paymentDetails,
        investmentAccount,
        amount,
        lastBalance,
        status: "PENDING"
      });

      const savedRequest = await newRequest.save();
      return res.status(201).json({message:"Success", data:savedRequest});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // UPDATE WITHDRAWAL REQUEST STATUS
  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updatedRequest = await WithdrawalRequest.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedRequest) {
        return res.status(404).json({ error: "Withdrawal request not found" });
      }

      return res.status(200).json({message:"Success", data:updatedRequest});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // DELETE A WITHDRAWAL REQUEST
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req["currentUser"].id;

      const deletedRequest = await WithdrawalRequest.findOneAndUpdate(
        { _id: id, user },
        { status: "DELETED" }, // Update status instead of deleting
        { new: true }
      );

      if (!deletedRequest) {
        return res.status(404).json({ error: "Withdrawal request not found" });
      }

      return res.status(200).json({ message: "Withdrawal request deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // GET ALL WITHDRAWAL REQUESTS FOR A USER
  static async findAll(req: Request, res: Response) {
    try {
      const user = req["currentUser"].id;
      const requests = await WithdrawalRequest.find({ user, status: { $ne: "DELETED" } })
        .populate("investmentAccount")
        .populate("paymentDetails")
        .sort({ createdAt: -1 });

      return res.status(200).json({message:"Success", data:requests});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // GET SINGLE WITHDRAWAL REQUEST
  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req["currentUser"].id;

      const request = await WithdrawalRequest.findOne({ _id: id, user });

      if (!request) {
        return res.status(404).json({ error: "Withdrawal request not found" });
      }

      return res.status(200).json({message:"Success", data:request});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
