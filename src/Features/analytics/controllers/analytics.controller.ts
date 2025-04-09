import {Request, Response} from "express";
import Analytics from "../schema/analytics.schema";
import InvestmentAccount from "../../investmentAccount/schema/investmentAccount.schema";
import mongoose from "mongoose";
import Block from "../../blocks/schema/blocks.schema";
import Property from "../../property/schema/property.schema";

export class AnalyticsController {
   
  static async add(req: Request, res: Response) {
    try {
      const {
        year,
        last_year_revenue,
        total_revenue_paid_ytd,
        total_investment,
        number_of_months_payments,
      } = req.body;
      const analytics = new Analytics({
        year,
        last_year_revenue,
        total_revenue_paid_ytd,
        total_investment,
        number_of_months_payments,
      });
      await analytics.save();

      return res.status(200).json({
        success: true,
        message: "Analytics added successful"
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "System error",
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        year,
        last_year_revenue,
        total_revenue_paid_ytd,
        total_investment,
        number_of_months_payments,
      } = req.body;
  
      const updated = await Analytics.findByIdAndUpdate(
        id,
        {
          year,
          last_year_revenue,
          total_revenue_paid_ytd,
          total_investment,
          number_of_months_payments,
        },
        { new: true } // return the updated document
      );
  
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Analytics record not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Analytics updated successfully",
        data: updated,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "System error",
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
  
      const deleted = await Analytics.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Analytics record not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Analytics record deleted successfully",
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "System error",
      });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
  
      const analytics = await Analytics.findById(id);
  
      if (!analytics) {
        return res.status(404).json({
          success: false,
          message: "Analytics record not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "System error",
      });
    }
  }

  static async getByYear(req: Request, res: Response) {
    try {
      const { year } = req.query;

      console.log('year :>> ', year);

      const analytics = await Analytics.find({year}).sort({ createdAt: -1 });
  
      if (!analytics) {
        return res.status(404).json({
          success: false,
          message: "Analytics record not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "System error",
      });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const analyticsList = await Analytics.find().sort({ year: -1 });
  
      return res.status(200).json({
        success: true,
        data: analyticsList,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "System error",
      });
    }
  }
  
  /**
   * Get all analytics records
   */
  // 1. Portfolio value,
// 2. Monthly income,
// 3. Total income,
// 4. Cash balance,
// 5. Total properties,
// 6. Total bloks owned,
// 7. Annual revenue
  static async getPortfolio(req: Request, res: Response) {
    try {
      const userId = req['currentUser'].id
      const { year } = req.query;
      const analytics = await Analytics.findOne({ year }).sort({ createdAt: -1 });
      
      const result = await Block.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            status: "ACTIVE"
          }
        },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            totalAmount: { $sum: "$purchasePrice" },
            uniqueProperties: { $addToSet: "$propertyId" } // collect unique propertyIds
          }
        },
        {
          $project: {
            _id: 0,
            totalCount: 1,
            totalAmount: 1,
            uniquePropertyCount: { $size: "$uniqueProperties" } // count unique ones
          }
        }
      ]);
      
      console.log('result :>> ', result);
      
      const blocksOwned = result[0]?.totalCount || 0;
      const totalInvestmentBalance = result[0]?.totalAmount || 0;

      const totalProperties = result[0]?.uniquePropertyCount || 0;

      
      const accounts =  await InvestmentAccount.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            status: "VERIFIED"
          }
        },
        {
          $group: {
            _id: null,
            totalBalance: { $sum: "$balance" }
          }
        }
      ]);
      

      // PROPERTY
      const totalBloks = await Property.aggregate([
        { $match: { status: "ACTIVE" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$total_bloks" }
          }
        }
      ]);
      
      const totalPropertyBlocks = totalBloks[0]?.total || 0;
      console.log("Total ACTIVE blocks:", totalPropertyBlocks);

      const monthlyIncome = 0;
console.log('analytics :>> ', analytics);

      return res.status(200).json({
        success: true,
        message: "Analytics(portfolio) successful response",
        response: {
          cashBalance: accounts[0].totalBalance,
          blocksOwned,
          portfolioValue: totalInvestmentBalance,
          totalPropertyBlocks,
          totalProperties,
          monthlyIncome: (analytics.last_year_revenue / totalPropertyBlocks) * blocksOwned,
          totalIncome: 100,
          annualRentalYield: (((analytics.total_revenue_paid_ytd/analytics.number_of_months_payments)/totalInvestmentBalance)*12)*100,
        },
      });
    } catch (e) {
      console.log('e :>> ', e);
      return res.status(500).json({
        success: false,
        message: "System error",
      });
    }
  }

  // 1. Total investment balance,
// 2. Cash balance
  static async getWallet(req: Request, res: Response) {
    try {
      const userId = req['currentUser'].id
      const result = await Block.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            status: "ACTIVE"
          }
        },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            totalAmount: { $sum: "$purchasePrice" }
          }
        }
      ]);
      
      const blocksOwned = result[0]?.totalCount || 0;
      const totalInvestmentBalance = result[0]?.totalAmount || 0;

      
      const accounts =  await InvestmentAccount.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            status: "VERIFIED"
          }
        },
        {
          $group: {
            _id: null,
            totalBalance: { $sum: "$balance" }
          }
        }
      ]);
      

      return res.status(200).json({
        success: true,
        message: "Analytics(wallet) successful response",
        response: {
          cashBalance: accounts[0].totalBalance,
          blocksOwned,
          totalInvestmentBalance
        },
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "System error",
      });
    }
  }
}
