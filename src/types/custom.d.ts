import "express";
import multer from "multer";

declare global {
    namespace Express {
        interface Request {
            // Optional file from multer
            file?: Express.Multer.File;
            // Current authenticated user payload
            currentUser?: { id: string; [key: string]: any };
        }
    }
}
 