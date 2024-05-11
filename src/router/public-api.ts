import { Router } from "express";
import { UserController } from "../controller/user-controller";

export const publicRouter: Router = Router();

// User API
publicRouter.post("/api/v1/users/register", UserController.submitRegistration);
publicRouter.post("/api/v1/users/login", UserController.submitLogin);