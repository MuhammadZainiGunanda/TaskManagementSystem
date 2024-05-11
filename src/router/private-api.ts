import { Router } from "express";
import { authenticationMiddleware } from "../middleware/auth-middleware";
import { UserController } from "../controller/user-controller";

export const privateRouter: Router = Router();

privateRouter.use(authenticationMiddleware);

// Users API
privateRouter.get("/api/v1/users/me", UserController.submitGetProfile);
privateRouter.put("/api/v1/users/me", UserController.submitUpdateProfile);
privateRouter.put("/api/v1/users/change-password", UserController.submitChangePassword);