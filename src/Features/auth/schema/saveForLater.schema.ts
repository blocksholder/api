import mongoose, { Schema, Document } from "mongoose";

export interface ISavedForLater extends Document {
  user: mongoose.Schema.Types.ObjectId;
  property: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const SavedForLaterSchema = new Schema<ISavedForLater>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  { timestamps: true }
);

const SavedForLater = mongoose.model<ISavedForLater>("SavedForLater", SavedForLaterSchema);
export default SavedForLater;
