const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema(
  {
    file: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

const Document = mongoose.model('Document', documentSchema);

export default Document;
