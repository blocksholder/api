import mongoose, { Schema, Document } from "mongoose";

export interface ICallBackRequest extends Document {
  user: mongoose.Schema.Types.ObjectId;
  fullname: string;
  email: string;
  message: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  createdAt: Date;
}

const CallBackRequestSchema = new Schema<ICallBackRequest>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "IN_PROGRESS", "COMPLETED"], default: "PENDING" },
  },
  { timestamps: true }
);

const CallBack = mongoose.model<ICallBackRequest>("CallBackRequest", CallBackRequestSchema);
export default CallBack;
