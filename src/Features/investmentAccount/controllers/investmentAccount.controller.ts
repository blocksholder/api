import { Request, Response } from "express";
import * as Express from 'express';
import InvestmentAccount from "../schema/investmentAccount.schema";
import * as multer from 'multer';

interface MulterRequest extends Request {
  files?: multer.File[];
}

class InvestmentAccountController {
  // Create Investment Account
  static async create(req: MulterRequest, res: Response) {
    try {
      const { accountName, type } = req.body;
      const user = req["currentUser"].id;

      // const files = req.file
      const files = req.files || []

      console.log('files :>> ', files);

      // Map uploaded files to documents array
      const documents = files.map((file) => ({
        name: file.originalname,
        path: `${file.fieldname}/${file.filename}` ,
        date_time: new Date(),
      }));


      const newAccount = await InvestmentAccount.create({ user,type, accountName, documents });

      return res.status(201).json({message:"Success", data:newAccount});
    } catch (error) {
      console.log('error :>> ', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get All Investment Accounts
  static async getAll(req: Request, res: Response) {
    try {
      const accounts = await InvestmentAccount.find({ user: req["currentUser"].id });
      return res.status(200).json({message:"Success", data:accounts});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get Investment Account by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const account = await InvestmentAccount.findOne({ _id: id, user: req["currentUser"].id });

      if (!account) {
        return res.status(404).json({ error: "Investment account not found" });
      }

      return res.status(200).json({message:"Success", data:account});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Update Investment Account Status
  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["VERIFIED", "PENDING", "REJECTED"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updatedAccount = await InvestmentAccount.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedAccount) {
        return res.status(404).json({ error: "Investment account not found" });
      }

      return res.status(200).json({message:"Success", data:updatedAccount});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Delete Investment Account
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req["currentUser"].id
      const deletedAccount = await InvestmentAccount.findByIdAndUpdate(
        { _id: id, user },
        { status: "DELETED" },
        { new: true }
      );
    

      if (!deletedAccount) {
        return res.status(404).json({ error: "Investment account not found" });
      }

      return res.status(200).json({ message: "Investment account deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default InvestmentAccountController;
