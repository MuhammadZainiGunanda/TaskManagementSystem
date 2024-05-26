import { NextFunction, Response } from "express";
import { RequestUserValidator } from "../types/request-middleware";
import { CreateRequest, DeleteRequest, FilterRequest, SortingRequest, TaskOperationOutcome, UpdateRequest } from "../model/task-management";
import { ZodError } from "zod";
import { TaskService } from "../service/task-service";
import { ResponseError } from "../error/response-error";
import { Prisma } from "@prisma/client";
import { HttpResponseDispatcher } from "../util/sendJsonResponsUtil";

export class TaskController {

     public static async submitCreateTask(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Mengkonstruksi objek CreateRequest dengan request body yang diberikan
               const createTaskRequest: CreateRequest = {
                    ...request.body,
                    user_id: request.user?.id
               }

               // Panggil layanan untuk proses create task dengan mengirim objek CreateRequest
               const submitCreateTaskConfirmation: TaskOperationOutcome | ZodError = 
                    await TaskService.createTask(createTaskRequest);

               // Kirim respon sukses dengan status 200 dan hasil dari create task
               HttpResponseDispatcher
                    .dispatchJsonResponse(response, 200, "Create task successfully", submitCreateTaskConfirmation, {});
          } catch (error) {
               next(error); // Jika errors, lewatkan error ke middleware selanjutnya
          }
     }

     public static async submitGetAllTasks(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk proses get all data tasks dengan mengirim userId dari request
               const submitGetAllTasksConfirmation: TaskOperationOutcome[] = 
                    await TaskService.getAllTasks(request.user?.id!);

               // Kirim respon sukses dengan status 200 serta hasil dari proses get all data
               HttpResponseDispatcher
                    .dispatchJsonResponse(response, 200, "Tasks retrieved successfully", submitGetAllTasksConfirmation, {})
          } catch (error) {
               next(error) // Jika errors, lewatkan error ke middleware selanjutnya
          }
     }

     public static async submitGetTaskByID(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk proses get tasks by id dengan mengirim taskId dari params yang diberikan
               const submitGetTaskByIDConfirmation: TaskOperationOutcome | ResponseError = 
                    await TaskService.getTaskByID(Number(request.params.taskId));

               // Kirim respon sukses dengan status 200 serta hasil dari proses get tasks by id
               HttpResponseDispatcher
                    .dispatchJsonResponse(response, 200, "Tasks retrieved successfully", submitGetTaskByIDConfirmation, {});
          } catch (error) {
               next(error); // Jika errors, lewatkan error ke middleware selanjutnya
          }
     }

     public static async submitUpdateTask(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Mengkonstruksi objek UpdateRequest dari request serta param yang diberikan
               const createPayload: UpdateRequest = {
                    id: Number(request.params.taskId),
                    ...request.body,
                    user_id: request.user?.id
               };

               // Panggil layanan untuk proses update task dengan mengirim objek UpdateRequest
               const submitUpdateTaskConfirmation: TaskOperationOutcome | ResponseError | ZodError = 
                    await TaskService.updateTask(createPayload);

               // Kirim respon sukses dengan status 200 serta hasil dari proses update task
               HttpResponseDispatcher
                    .dispatchJsonResponse(response, 200, "Task updated successfully", submitUpdateTaskConfirmation, {});
          } catch (error) {
               next(error) // Jika errors, lewatkan error ke middleware selanjutnya
          }
     }

     public static async submitDeleteTask(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Mengkonstruksi objek DeleteRequest dari request serta param yang diberikan
               const deleteTaskRequest: DeleteRequest = {
                    userId: request.user?.id!,
                    taskId: Number(request.params.taskId)
               };

               // Panggil layanan untuk proses delete task dengan mengirim objek DeleteRequest
               const submitDeleteTaskConfirmation: TaskOperationOutcome | ResponseError = 
                    await TaskService.deleteTask(deleteTaskRequest);

               // Kirim respon sukses dengan status 200 sebagai menandakan proses hapus data berhasil
               HttpResponseDispatcher
                    .dispatchJsonResponse(response, 200, "Deleted task successsfully", "OK", {});
          } catch (error) {
               next(error); // Jika errors, lewatkan error ke middleware selanjutnya
          }
     }

     public static async submitFilterTasks(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Mengkonstruksi objek FilterRequest dari request serta query param yang diberikan
               const filterTaskRequest: FilterRequest = {
                    userId: request.user?.id!,
                    status: String(request.query.status)
               }

               // Panggil layanan untuk proses filtering task dengan mengirim objek FilterRequest
               const submitFilterTaskConfirmation: TaskOperationOutcome[] | ResponseError = 
                    await TaskService.filterTasks(filterTaskRequest);

               // Kirim respon sukses dengan status 200 serta hasil dari proses filter
               HttpResponseDispatcher.dispatchJsonResponse(response, 200, "Tasks retrieved successfully", submitFilterTaskConfirmation, {});
          } catch (error) {
               next(error); // Jika errors, lewatkan error ke middleware selanjutnya
          }
     }
     
     public static async submitSortingTasks(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Mengkonstuksi objek SortingRequest dari request serta query param yang diberikan
               const sortingTaskRequest: SortingRequest = {
                    userId: request.user?.id!,
                    sortBy: request.query.sortBy ? String(request.query.sortBy) : "dueDate",
                    order: request.query.order ? Prisma.SortOrder.desc : "asc"
               }

               // Panggil layanan untuk proses sorting tasks dengan mengirim objek SortingRequest
               const submitSortingTaskConfirmation: TaskOperationOutcome[] | ResponseError = 
                    await TaskService.sortingTasks(sortingTaskRequest);

               // Kirim respon sukses dengan status 200 serta hasil dari proses sorting tasks
               HttpResponseDispatcher
                    .dispatchJsonResponse(response, 200, "Tasks retrieved successfully", submitSortingTaskConfirmation, {});
          } catch (error) {
               next(error); // Jika errors, lewatkan error ke middleware selanjutnya
          }
     }

     public static async submitAssignTask(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk proses Assign taks dengan mengirim userId dari request
               const submitAssignTaskConfirmation: TaskOperationOutcome | ResponseError = 
                    await TaskService.assignTask(Number(request.user?.id));

               // Kirim respon suksess dengan status 200 serta hasil dari proses Assing task
               HttpResponseDispatcher
                    .dispatchJsonResponse(response, 200, "Task retrieved successfully", submitAssignTaskConfirmation, {});
          } catch (error) {
               next(error); // Jika errors, lewatkan error ke middleware selanjutnya
          }
     }
}