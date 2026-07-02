import { Request } from "express";

export interface RequestWithUser extends Request {
  currentUser?: { id: string; [key: string]: any };
}
