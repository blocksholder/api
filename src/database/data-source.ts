import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({path: "../.env"});
// Connect to MongoDB
console.log(process.env.DB_URL)
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      sanitizeFilter: true,
      autoCreate: true,
    });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectToDatabase;
