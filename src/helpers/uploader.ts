import * as path from 'path';
const multer = require("multer");
const fs = require('fs');

const createUploadsDirIfNotExists = (uploadPath: string) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true }); // create the directory if it doesn't exist
  } 
};
 
// Configure Multer storage - Store files in private attachments directory
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    // Get user ID from authenticated request, or use 'anonymous' as fallback
    const userId = req.currentUser?.id || 'anonymous';
    // Use attachments folder (outside public directory) organized by user and field type
    const uploadPath = path.join(__dirname, `../../attachments/${userId}/${file.fieldname}`);
    createUploadsDirIfNotExists(uploadPath); 

    cb(null, uploadPath); // Directory to save the files
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize multer with the configured storage
export const upload = multer({ storage });
   