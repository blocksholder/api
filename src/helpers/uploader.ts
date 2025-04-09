import * as path from 'path';
const multer = require("multer");
const fs = require('fs');

const createUploadsDirIfNotExists = (uploadPath: string) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true }); // create the directory if it doesn't exist
  }
};

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.fieldname ? path.join(__dirname, `../public/${file.fieldname}`) : path.join(__dirname, '../public/uploads'); // Use provided path or default
    createUploadsDirIfNotExists(uploadPath);

    cb(null, uploadPath); // Directory to save the files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize multer with the configured storage
export const upload = multer({ storage });
