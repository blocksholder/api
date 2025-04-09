import {Request, Response} from "express";
import Property from "../schema/property.schema";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";


interface MulterRequest extends Request {
  file: multer.File;
}

export class PropertyController {
  
  static async create(req: MulterRequest, res: Response) {
  
    try {
      const {
        type,
        title,
        location,
        project_cost,
        current_investors,
        total_bloks,
        available_bloks,
        blok_cost,
        property_details,
        key_metrics,
        total_investors,
        yearly_investment_return,
        projected_net_yield,
        return_on_quality,
        appreciation_rate,
        currency,
        description
      } = req.body;

      if (!type || !location || !property_details || !currency || !description) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Process uploaded image
      let imageUrl = req.file ? `${req.file.fieldname}/${req.file.filename}` : null;


      const newProperty = new Property({
        type,
        title,
        images: imageUrl ? [{ url: imageUrl }] : [],
        location: JSON.parse(location),
        project_cost,
        current_investors,
        total_bloks,
        available_bloks,
        blok_cost,
        property_details: JSON.parse(property_details),
        key_metrics: JSON.parse(key_metrics),
        total_investors,
        yearly_investment_return,
        projected_net_yield,
        return_on_quality,
        appreciation_rate,
        currency,
        description
      });

      const savedProperty = await newProperty.save();
      return res.status(201).json({message:'Success', data:savedProperty});

     
      
    } catch (error) {
      console.log('error :>> ', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
 

  static async findAll(req: Request, res: Response) {
    try {
      const properties = await Property.find({ status: { $ne: 'DELETED' } }).sort({ createdAt: -1 });
      return res.status(200).json({message:'Success', data:properties});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
    

  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const property = await Property.findById(id);
    
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
    
      return res.status(200).json({message:'Success', data:property});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
    

  static async findAndUpdate(req: MulterRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
    
      // Process uploaded image if available
      if (req.file) {
        updateData.images = [{ url: `${req.file.fieldname}/${req.file.filename}` }];
      }

      if (!updateData.location || !updateData.property_details || !updateData.key_metrics) {
        return res.status(400).json({ error: "Missing required fields" });
      }
    
      updateData.location = JSON.parse(updateData.location)
      updateData.property_details = JSON.parse(updateData.property_details)
      updateData.key_metrics = JSON.parse(updateData.key_metrics)

      const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules are applied
      });
    
      if (!updatedProperty) {
        return res.status(404).json({ error: "Property not found" });
      }
    
      return res.status(200).json({message:'Success', data:updatedProperty});
    } catch (error) {
      console.log('error :>> ', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }


  static async addImage(req: MulterRequest, res: Response) {
    try {
      const { id } = req.params;
  
      // Ensure an image was uploaded
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
  
      // Construct the image URL
      const imageUrl = `${req.file.fieldname}/${req.file.filename}`;
  
      // Update the property by adding the new image to the `images` array
      const updatedProperty = await Property.findByIdAndUpdate(
        id,
        { $push: { images: { url: imageUrl } } },
        { new: true, runValidators: true }
      );
  
      if (!updatedProperty) {
        return res.status(404).json({ error: "Property not found" });
      }
  
      return res.status(200).json({message:'Success', data:updatedProperty});
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  


  static async addDocument(req: MulterRequest, res: Response) {
    try {
      const { id } = req.params;
  
      // Ensure a document was uploaded
      if (!req.file) {
        return res.status(400).json({ error: "No document file provided" });
      }
  
      // Construct the document object
      const document = {
        name: req.file.originalname,
        path: `${req.file.fieldname}/${req.file.filename}`,
        date_time: new Date()
      };
  
      // Update the property by adding the new document to the `documents` array
      const updatedProperty = await Property.findByIdAndUpdate(
        id,
        { $push: { documents: document } },
        { new: true, runValidators: true }
      );
  
      if (!updatedProperty) {
        return res.status(404).json({ error: "Property not found" });
      }
  
      return res.status(200).json({message:'Success', data:updatedProperty});
    } catch (error) {
      console.log('error :>> ', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
  
      // Find the property and update its status to "DELETED"
      const updatedProperty = await Property.findByIdAndUpdate(
        id,
        { status: "DELETED" },
        { new: true, runValidators: true }
      );
  
      if (!updatedProperty) {
        return res.status(404).json({ error: "Property not found" });
      }
  
      return res.status(200).json({ message: "Property marked as DELETED", updatedProperty });
    } catch (error) {
      console.log('error :>> ', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  

  static async deleteImage(req: Request, res: Response) {
    try {
      const { id } = req.params; // Property ID
      const { imageId } = req.body; // Image ID to delete
  
      // Find the property
      const property = await Property.findById(id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
  
      // Find the image to remove
      const imageIndex = property.images.findIndex(img => img._id.toString() === imageId);
      if (imageIndex === -1) {
        return res.status(400).json({ error: "Image not found" });
      }
  
      // Get image URL and remove from DB
      const imageUrl = property.images[imageIndex].url;
      property.images.splice(imageIndex, 1);
      await property.save();
  
      // Remove file from storage
      const filePath = path.join(__dirname,  "../../../public", imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
  
      return res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  


  static async deleteDocument(req: Request, res: Response) {
    try {
      const { id } = req.params; // Property ID
      const { documentId } = req.body; // Document ID to delete
  
      // Find the property
      const property = await Property.findById(id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
  
      // Find the document to remove
      const docIndex = property.documents.findIndex(doc => doc._id.toString() === documentId);
      if (docIndex === -1) {
        return res.status(400).json({ error: "Document not found" });
      }
  
      // Get document path and remove from DB
      const documentPath = property.documents[docIndex].path;
      property.documents.splice(docIndex, 1);
      await property.save();
  
      // Remove file from storage
      const filePath = path.join(__dirname, "../../../public", documentPath);
     console.log('filePath :>> ', filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
  
      return res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  



}    
