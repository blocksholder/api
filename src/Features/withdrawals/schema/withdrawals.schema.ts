import mongoose, { Schema, Document } from "mongoose";
import * as crypto from "crypto"; 
import { PaymentDetailsSchema } from "../../paymentDetails/schema/payment.schema";
PaymentDetailsSchema
export interface IWithdrawalRequest extends Document {
  user: mongoose.Types.ObjectId;
  resourceId: string;
  paymentDetails?: typeof PaymentDetailsSchema;
  investmentAccount: mongoose.Types.ObjectId;
    amount: number;
    lastBalance?: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}

// Generate a unique 6-character alphanumeric account ID
const generateRefID = (): string => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-character hex
};

const WithdrawalRequestSchema = new Schema<IWithdrawalRequest>(
  {
    resourceId: { type: String, unique: true, required: true, default: generateRefID },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentDetails: {type: PaymentDetailsSchema},
    investmentAccount: { type: mongoose.Schema.Types.ObjectId, ref: "InvestmentAccount", required: true },
        amount: { type: Number, required: true, min: 1 },
        lastBalance: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" }
  },
  { timestamps: true }
);

const WithdrawalRequest = mongoose.model<IWithdrawalRequest>("WithdrawalRequest", WithdrawalRequestSchema);

export default WithdrawalRequest;
