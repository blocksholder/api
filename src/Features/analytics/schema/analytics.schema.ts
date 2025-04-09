const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnalyticsSchema = new Schema(
  {
        year: { type: String, required: false, unique: true },
        last_year_revenue: { type: String, required: false },
        total_revenue_paid_ytd: { type: String, required: false },
        total_investment: { type: String, required: false },
        number_of_months_payments: { type: String, required: false }, 
    status: {
      type: String,
      enum: ["ACTIVE", "DEACTIVE"],
      default: "ACTIVE",
    },
  },
  {timestamps: true}
);

const Analytics = mongoose.model("Analytics", AnalyticsSchema);

export default Analytics;
