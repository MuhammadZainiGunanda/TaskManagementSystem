import { User } from "@prisma/client";
import { Request } from "express";

export interface RequestUserValidator extends Request {
     user?: User;
}