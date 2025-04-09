import { Request, Response } from "express";
import Property from "../../property/schema/property.schema";
import Block from "../schema/blocks.schema";


class BlockController {


    // Get all blocks
    static async getAllBlocks(req: Request, res: Response) {
      try {
        const userId = req['currentUser'].id
        const blocks = await Block.find({ userId, status: "ACTIVE" })
          // .populate("propertyId").populate("userId");
        return res.status(200).json({ message: "Blocks fetched successfully", data: blocks });
      } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }


  static async relinquishBlock(req: Request, res: Response) {
    try {
      const { blockId } = req.body;

      const block = await Block.findOne({_id:blockId, status:"ACTIVE"});
      if (!block) return res.status(404).json({ error: "Block not found" });

      if (block.status == "RELINQUISHED") return res.status(404).json({ error: "Property already relinquised" });

      const property = await Property.findById(block.propertyId);
      if (!property) return res.status(404).json({ error: "Property not found" });

     
      block.status = "RELINQUISHED";
      await block.save();
      
      property.available_bloks += 1;
      await property.save();

      // console.log('property :>> ', property);

      return res.status(200).json({ message: "Block relinquished successfully", data: block });
    } catch (error) {
      console.error("Error relinquishing block:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async transferBlock(req: Request, res: Response) {
    try {
      const { blockId, newOwnerId } = req.body;

      const block = await Block.findOne({_id:blockId, status: "ACTIVE"});
      if (!block) return res.status(404).json({ error: "Block not found" });

      if (block.status == "TRANSFERRED") return res.status(404).json({ error: "Property already transferred" });

      block.previousOwners.push(block.userId);
      block.userId = newOwnerId;
      block.status = "TRANSFERRED";
      await block.save();

      return res.status(200).json({ message: "Block transferred successfully", data: block });
    } catch (error) {
      console.error("Error transferring block:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }



   // Relinquish multiple blocks
   static async relinquishMultipleBlocks(req: Request, res: Response) {
    try {
      const { blockIds } = req.body;
  
      if (!Array.isArray(blockIds) || blockIds.length === 0) {
        return res.status(400).json({ error: "Invalid blockIds array" });
      }
  
      const blocks = await Block.find({ _id: { $in: blockIds }, status: "ACTIVE" });
  
      if (blocks.length === 0) {
        return res.status(404).json({ error: "No valid blocks found" });
      }
  
      const propertyUpdates: Record<string, number> = {}; // Object to track property availability updates
  
      for (const block of blocks) {
        if (block.status === "RELINQUISHED") {
          return res.status(400).json({ error: `Block ${block._id} is already relinquished` });
        }
  
        block.status = "RELINQUISHED";
        const propertyIdStr = block.propertyId.toString(); 
        // Track how many blocks should be added back per property
        if (!propertyUpdates[propertyIdStr]) {
          propertyUpdates[propertyIdStr] = 0;
        }
        propertyUpdates[propertyIdStr] += 1;
      }
  
      await Block.bulkSave(blocks); // Save all block updates in one go
  
      // Update property availability in bulk
      const updatePromises = Object.entries(propertyUpdates).map(([propertyId, increment]) =>
        Property.findByIdAndUpdate(propertyId, { $inc: { available_bloks: increment } })
      );
      await Promise.all(updatePromises);
  
      return res.status(200).json({ message: "Blocks relinquished successfully", data: blocks });
    } catch (error) {
      console.error("Error relinquishing blocks:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  

  // Transfer multiple blocks
  static async transferMultipleBlocks(req: Request, res: Response) {
    try {
      const { blockIds, newOwnerId } = req.body; // Expecting an array of block IDs

      if (!Array.isArray(blockIds) || blockIds.length === 0) {
        return res.status(400).json({ error: "Invalid block IDs" });
      }

      const blocks = await Block.find({ _id: { $in: blockIds }, status: "ACTIVE" });

      if (blocks.length !== blockIds.length) {
        return res.status(404).json({ error: "Some blocks not found or are not active" });
      }

      for (const block of blocks) {
        if (block.status === "TRANSFERRED") {
          return res.status(400).json({ error: `Block ${block._id} is already transferred` });
        }

        block.previousOwners.push(block.userId);
        block.userId = newOwnerId;
        block.status = "TRANSFERRED";
        await block.save();
      }

      return res.status(200).json({ message: "Blocks transferred successfully", data: blocks });
    } catch (error) {
      console.error("Error transferring blocks:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

}

export default BlockController;
