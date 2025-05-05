import mongoose, { Schema, Document } from "mongoose";
import * as crypto from "crypto"; // For generating 6-character alphanumeric accountID

// Document Schema
const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  date_time: { type: Date, default: Date.now }
});

// Investment Account Interface
interface IInvestmentAccount extends Document {
  user: mongoose.Types.ObjectId;
  accountID: string;
  accountName: string;
  type: "PERSONAL" | "COMPANY";
  balance: number;
  status: "VERIFIED" | "PENDING" | "REJECTED";
  documents?: typeof DocumentSchema[];
  createdAt: Date;
  updatedAt: Date;
}

// Generate a unique 6-character alphanumeric account ID
const generateAccountID = (): string => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-character hex
};

// Investment Account Schema
const InvestmentAccountSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["PERSONAL", "COMPANY"], default: "PERSONAL" },
    accountID: { type: String, unique: true, required: true, default: generateAccountID },
    accountName: { type: String, required: true },
    address: { type: String, required: false },
    email: { type: String, required: false },
    balance: { type: Number, default: 0 },
    status: { type: String, enum: ["VERIFIED", "PENDING", "REJECTED"], default: "PENDING" },
    documents: [DocumentSchema]
  },
  { timestamps: true }
);

const InvestmentAccount = mongoose.model<IInvestmentAccount>("InvestmentAccount", InvestmentAccountSchema);
export default InvestmentAccount