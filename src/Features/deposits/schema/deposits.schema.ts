import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import * as crypto from "crypto"; 

interface IDeposit extends Document {
  user: mongoose.Types.ObjectId;
  investmentAccount: mongoose.Types.ObjectId;
  amount: number;
  resourceId: string;
  lastBalance: number;
  paymentMethod?: string;
    transactionId?: string; 
    referenceId?: string; 
  status: "PENDING" | "SUCCESS" | "FAILED" | "DELETED";
  createdAt: Date;
  updatedAt: Date;
}


// Generate a unique 6-character alphanumeric account ID
const generateRefID = (): string => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-character hex
};

const DepositSchema: Schema = new Schema(
  {
    resourceId: { type: String, unique: true, required: true, default: generateRefID },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    investmentAccount: { type: mongoose.Schema.Types.ObjectId, ref: "InvestmentAccount", required: true },
    amount: { type: Number, required: true },
    lastBalance: { type: Number, required: true },
    paymentMethod: { type: String, required: false },
    transactionId: { type: String, required: false },
    referenceId: { type: String, unique: true, required: true, default: () => uuidv4() },
    status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED", "DELETED"], default: "PENDING" }
  },
  { timestamps: true }
);


const Deposit = mongoose.model<IDeposit>("Deposit", DepositSchema);
export default Deposit;