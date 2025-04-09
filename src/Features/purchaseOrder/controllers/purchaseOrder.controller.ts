import { Request, Response } from "express";
import Property from "../../property/schema/property.schema";
import InvestmentAccount from "../../investmentAccount/schema/investmentAccount.schema";
import Block from "../../blocks/schema/blocks.schema";
import PurchaseOrder from "../schema/purchaseOrder.schema";



class PurchaseOrderController {
  static async createPurchaseOrder(req: Request, res: Response) {
    try {
      const userId = req['currentUser'].id
      const { propertyId, investmentAccountId, quantity, costPerBlock, serviceFees } = req.body;

      const property = await Property.findById(propertyId);
      if (!property) return res.status(404).json({ error: "Property not found" });

      if (property.available_bloks < quantity) {
        return res.status(400).json({ error: "Not enough blocks available" });
      }

      const totalAmount = quantity * costPerBlock;
      const totalBlockAmount = totalAmount + serviceFees;

      const investmentAccount = await InvestmentAccount.findById(investmentAccountId);
      console.log('investmentAccount :>> ', investmentAccount);
      if (!investmentAccount || investmentAccount.balance < totalBlockAmount) {
        return res.status(400).json({ error: "Insufficient funds in Investment Account", currentBalance: investmentAccount.balance });
      }

      investmentAccount.balance -= totalBlockAmount;
      await investmentAccount.save();

      const newOrder = await PurchaseOrder.create({
        userId,
        propertyId,
        investmentAccountId,
        quantity,
        costPerBlock,
        totalAmount,
        serviceFees,
        totalBlockAmount,
        status: "PAID",
      });

      property.available_bloks -= quantity;
      await property.save();

      const blocks = [];
      for (let i = 0; i < quantity; i++) {
        blocks.push({
          userId,
          propertyId,
          purchaseOrderId: newOrder._id,
          purchasePrice: costPerBlock,
          investmentAccountId,
          previousOwners: [],
          status: "ACTIVE",
        });
      }
      await Block.insertMany(blocks);

      return res.status(201).json({ message: "Blocks purchased successfully", blocks });
    } catch (error) {
      console.error("Error creating purchase order:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

    // Get all purchase orders
    static async getAllPurchaseOrders(req: Request, res: Response) {
      try {
        const userId = req['currentUser'].id
        const purchaseOrders = await PurchaseOrder.find({userId})
          // .populate("propertyId")
          .populate("investmentAccountId");
  
        return res.status(200).json({ message: "Purchase orders fetched successfully", data: purchaseOrders });
      } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  
}

export default PurchaseOrderController;
