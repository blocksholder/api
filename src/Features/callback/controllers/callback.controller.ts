import { Request, Response } from "express";
import CallBack from "../schema/callback.schema";
import mongoose from "mongoose";

class CallbackController {
  // Create Callback Request
  static async create(req: Request, res: Response) {
    try {
      const { id } = req['currentUser'];
      const { fullname, email, message } = req.body;

      if (!fullname || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const newRequest = new CallBack({ user:id, fullname, email, message });
      const savedRequest = await newRequest.save();

      return res.status(201).json({message:'Success', data:savedRequest});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get All Callback Requests
  static async findAll(req: Request, res: Response) {
    try {
      const userId = new mongoose.Types.ObjectId(req['currentUser'].id);
      const requests = await CallBack.find({user: userId}).sort({ createdAt: -1 });
      return res.status(200).json({message:'Success', data:requests});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get All Callback Requests
  static async findAllAdmin(req: Request, res: Response) {
    try {
      const requests = await CallBack.find().sort({ createdAt: -1 });
      return res.status(200).json({message:'Success', data:requests});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get Single Callback Request
  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const request = await CallBack.findById(id);

      if (!request) {
        return res.status(404).json({ error: "Callback request not found" });
      }

      return res.status(200).json({message:'Success', data:request});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Update Callback Request Status
  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updatedRequest = await CallBack.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedRequest) {
        return res.status(404).json({ error: "Callback request not found" });
      }

      return res.status(200).json({message:'Success',data:updatedRequest});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Delete Callback Request
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedRequest = await CallBack.findByIdAndDelete(id);

      if (!deletedRequest) {
        return res.status(404).json({ error: "Callback request not found" });
      }

      return res.status(200).json({ message: "Callback request deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default CallbackController;
