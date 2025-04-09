import { Request, Response } from "express";
import Deposit from "../schema/deposits.schema";
import InvestmentAccount from "../../investmentAccount/schema/investmentAccount.schema";

class DepositController {
  
  // CREATE a deposit
  static async create(req: Request, res: Response) {
    try {
      const { investmentAccount, amount, lastBalance, paymentMethod, referenceId } = req.body;
      const user = req["currentUser"].id;

      const deposit = await Deposit.create({
        user,
        investmentAccount,
        amount,
        lastBalance,
        paymentMethod,
        referenceId,
        status: "PENDING"
      });

      return res.status(201).json({message:"Success",data:deposit});
    } catch (error) {
      console.log('error :>> ', error);
      return res.status(500).json({ error: "Internal server error", message: 'ReferenceID already exists'  });
    }
  }

  // GET all deposits for a user
  static async findAll(req: Request, res: Response) {
    try {
      const user = req["currentUser"].id;
      const deposits = await Deposit.find({ user, status: { $ne: "DELETED" } })
        .populate("investmentAccount")
        .sort({ createdAt: -1 });
      
      return res.status(200).json({message:"Success", data:deposits});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // GET a single deposit by ID
  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req["currentUser"].id;

      const deposit = await Deposit.findOne({ _id: id, user });

      if (!deposit) {
        return res.status(404).json({ error: "Deposit not found" });
      }

      return res.status(200).json({message:"Success",data:deposit});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error"});
    }
  }

  // UPDATE deposit status via payment provider callback
static async updateCallback(req: Request, res: Response) {
  try {
    const { referenceId, status, transactionId } = req.body;

    if (!referenceId || !["PENDING", "SUCCESS", "FAILED"].includes(status)) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // Find the deposit using referenceId
    const deposit = await Deposit.findOne({ referenceId });

    if (!deposit) {
      return res.status(404).json({ error: "Deposit not found" });
    }

    // If deposit is already marked SUCCESS, no need to update
    if (deposit.status === "SUCCESS") {
      return res.status(400).json({ error: "Deposit already processed" });
    }

    // Update deposit status and transactionId
    deposit.status = status;
    deposit.transactionId = transactionId || deposit.transactionId; // Only update if provided
    await deposit.save();

    console.log('deposit.investmentAccount :>> ', deposit.investmentAccount);

    // If deposit is SUCCESS, update InvestmentAccount balance
    if (status === "SUCCESS") {
      const investmentAccount = await InvestmentAccount.findById(deposit.investmentAccount);

      if (!investmentAccount) {
        return res.status(404).json({ error: "Investment account not found" });
      }

      // Update the balance
      investmentAccount.balance += deposit.amount;
      await investmentAccount.save();
    }

    return res.status(200).json({ message: "Deposit updated successfully", deposit });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}


  // DELETE a deposit
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req["currentUser"].id;

      const deletedDeposit = await Deposit.findOneAndUpdate(
        { _id: id, user },
        { status:'DELETED' },
        { new: true }
      );;

      if (!deletedDeposit) {
        return res.status(404).json({ error: "Deposit not found" });
      }

      return res.status(200).json({ message: "Deposit deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default DepositController;
