const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    title: {type: String, required: true},
    body: {type: String, required: true},
    type: {type: String, required: true},
    status: {type: String, default: "UNREAD"},
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {timestamps: true} // Automatically adds createdAt & updatedAt
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
