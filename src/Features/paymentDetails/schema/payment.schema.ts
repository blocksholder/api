import mongoose, {Schema, Document} from "mongoose";

export interface IPaymentDetails extends Document {
  user: mongoose.Types.ObjectId;
  type: "BANK" | "CHECK";
  account_name: string;
  account_number: string;
  routing_number?: string;
  bank_name?: string;
  check_number?: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  createdAt: Date;
}

const PaymentDetailsSchema = new Schema<IPaymentDetails>(
  {
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    type: {type: String, enum: ["BANK", "CHECK"], required: true},
    account_name: {type: String, required: true},
    account_number: {type: String, required: true},
    routing_number: {type: String},
    bank_name: {type: String},
    check_number: {type: String},
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "DELETED"],
      default: "ACTIVE",
    },
  },
  {timestamps: true}
);

const PaymentDetails = mongoose.model<IPaymentDetails>(
  "PaymentDetails",
  PaymentDetailsSchema
);
export default PaymentDetails;
