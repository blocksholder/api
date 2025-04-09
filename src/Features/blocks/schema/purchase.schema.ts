import mongoose, { Schema, Document } from "mongoose";

export interface IPurchaseOrder extends Document {
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  investmentAccountId: mongoose.Types.ObjectId;
  quantity: number;
  costPerBlock: number;
  totalAmount: number;
  serviceFees: number;
  totalBlockAmount: number;
  status: "PAID" | "PENDING";
}

const PurchaseOrderSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    investmentAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "InvestmentAccount", required: true },
    quantity: { type: Number, required: true },
    costPerBlock: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    serviceFees: { type: Number, required: true },
    totalBlockAmount: { type: Number, required: true },
    status: { type: String, enum: ["PAID", "PENDING"], default: "PENDING" },
  },
  { timestamps: true }
);

const PurchaseOrder = mongoose.model<IPurchaseOrder>("PurchaseOrder", PurchaseOrderSchema);
export default PurchaseOrder;
