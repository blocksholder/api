import mongoose, { Schema, Document } from "mongoose";

export interface IBookmark extends Document {
  user: mongoose.Schema.Types.ObjectId;
  property: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
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

const Bookmark = mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
export default Bookmark;
