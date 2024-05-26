import { Router } from "express";
import { authenticationMiddleware } from "../middleware/auth-middleware";
import { UserController } from "../controller/user-controller";
import { TaskController } from "../controller/task-controller";

export const privateRouter: Router = Router();

privateRouter.use(authenticationMiddleware);

// Users API
privateRouter.get("/api/v1/users/me", UserController.submitGetProfile);
privateRouter.put("/api/v1/users/me", UserController.submitUpdateProfile);
privateRouter.put("/api/v1/users/change-password", UserController.submitChangePassword);

// Tasks API
privateRouter.post("/api/v1/tasks", TaskController.submitCreateTask);
privateRouter.get("/api/v1/tasks", TaskController.submitGetAllTasks);
privateRouter.get("/api/v1/tasks/:taskId(\\d+)", TaskController.submitGetTaskByID);
privateRouter.put("/api/v1/tasks/:taskId(\\d+)", TaskController.submitUpdateTask);
privateRouter.delete("/api/v1/tasks/:taskId(\\d+)", TaskController.submitDeleteTask);
privateRouter.get("/api/v1/tasks/filter", TaskController.submitFilterTasks);
privateRouter.get("/api/v1/tasks", TaskController.submitSortingTasks);
privateRouter.get("/api/v1/tasks/assign", TaskController.submitAssignTask);