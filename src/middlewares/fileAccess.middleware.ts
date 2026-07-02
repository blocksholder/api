import { Request, Response, NextFunction } from "express";
import * as path from "path";
import * as fs from "fs";
import { RequestWithUser } from "../types/request-with-user";

/**
 * Middleware to securely serve user documents
 * Verifies that the requesting user owns the file before serving it
 */
export const secureFileAccess = (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { userId, fieldName, fileName } = req.params;
    const requestingUserId = req.currentUser?.id;

    // Verify the user is requesting their own files
    if (userId !== requestingUserId) {
      return res.status(403).json({ 
        error: "Forbidden - You do not have access to these files" 
      });
    }

    // Prevent directory traversal attacks
    const sanitizedUserId = path.basename(userId);
    const sanitizedFieldName = path.basename(fieldName);
    const sanitizedFileName = path.basename(fileName);

    const filePath = path.join(
      __dirname,
      `../../attachments/${sanitizedUserId}/${sanitizedFieldName}/${sanitizedFileName}`
    );

    // Verify the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Send the file with proper headers
    res.download(filePath, sanitizedFileName, (err) => {
      if (err) {
        console.error("File download error:", err);
        res.status(500).json({ error: "Error downloading file" });
      }
    });
  } catch (error) {
    console.error("File access error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Middleware to serve files with MIME type detection
 * Used for displaying files inline (images, PDFs) vs downloading
 */
export const serveFile = (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { userId, fieldName, fileName } = req.params;
    const requestingUserId = req.currentUser?.id;

    // Verify ownership
    if (userId !== requestingUserId) {
      return res.status(403).json({ 
        error: "Forbidden - You do not have access to this file" 
      });
    }

    // Prevent directory traversal
    const sanitizedUserId = path.basename(userId);
    const sanitizedFieldName = path.basename(fieldName);
    const sanitizedFileName = path.basename(fileName);

    const filePath = path.join(
      __dirname,
      `../../attachments/${sanitizedUserId}/${sanitizedFieldName}/${sanitizedFileName}`
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Set proper content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      ".pdf": "application/pdf",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".doc": "application/msword",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    
    res.sendFile(filePath);
  } catch (error) {
    console.error("File serving error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
