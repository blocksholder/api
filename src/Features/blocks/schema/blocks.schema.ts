import mongoose, { Schema, Document } from "mongoose";


export interface IBlock extends Document {
    userId: mongoose.Types.ObjectId;
    propertyId: mongoose.Types.ObjectId;
    purchaseOrderId: mongoose.Types.ObjectId;
    investmentAccountId: mongoose.Types.ObjectId;
    previousOwners: mongoose.Types.ObjectId[];
  status: "ACTIVE" | "RELINQUISHED" | "TRANSFERRED";
  purchasePrice: 0
  }
  
  const BlockSchema: Schema = new Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
      purchasePrice: {type: Number},
      purchaseOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder", required: true },
      investmentAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "InvestmentAccount", required: true },
      previousOwners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      status: { type: String, enum: ["ACTIVE", "RELINQUISHED", "TRANSFERRED"], default: "ACTIVE" },
    },
    { timestamps: true }
  );
  
  const Block = mongoose.model<IBlock>("Block", BlockSchema);
  export default Block;
  