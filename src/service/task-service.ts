import { Status, Task } from "@prisma/client";
import { CreateRequest, DeleteRequest, FilterRequest, SortingRequest, TaskOperationOutcome, UpdateRequest, convertToTaskResponseOutcome } from "../model/task-management";
import { Validation } from "../validation/validation";
import { TaskValidationRules } from "../validation/task-validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { ZodError } from "zod";

export class TaskService {

     public static async createTask(createRequest: CreateRequest): Promise<TaskOperationOutcome | ZodError> {
          // Proses validasi create
          Validation.validate(TaskValidationRules.CREATE_TASK_VALIDATION_RULES, createRequest);

          // Buat record baru di database
          const createRecord: Task = await prismaClient.task.create({
               data: createRequest
          });

          // Konversi data task dengan rules format yang sesuai
          return convertToTaskResponseOutcome(createRecord);
     }

     public static async getAllTasks(userId: number): Promise<TaskOperationOutcome[]> {
          // Cari semua record tasks berdasarkan user id yang diberikan
          const findTasksByUserId: Task[] = await prismaClient.task.findMany({
               where: { user_id: userId }
          });

          if (findTasksByUserId.length < 1) {
               throw new ResponseError(404, "No task found matching the criteria", "Task not found");
          }

          // Konversi data tasks dengan rules format yang sesuai
          return findTasksByUserId.map(record => convertToTaskResponseOutcome(record));
     }

     public static async getTaskByID(taskId: number): Promise<TaskOperationOutcome | ResponseError> {
          // Cari record task berdasarkan task id yang diberiakan
          const findTasksById: Task | null = await prismaClient.task.findFirst({
               where: { id: taskId }
          });

          // Jika record tidak ada di database, berikan ResponseError
          if (!findTasksById) {
               throw new ResponseError(404, "No task found matching the criteria", "Task not found");
          }

          // Konversi data task dengan rules format yang sesuai
          return convertToTaskResponseOutcome(findTasksById);
     }

     public static async updateTask(updateRequest: UpdateRequest): Promise<TaskOperationOutcome | ResponseError | ZodError> {
          // Proses validasi update
          Validation.validate(TaskValidationRules.UPDATED_VALIDATION_RULES, updateRequest);

          // Cek apakah record task berdasarkan task id yang diberikan ada atau tidak di database
          const checkTaskMustExist: Task | null = await prismaClient.task.findFirst({
               where: { id: updateRequest.id, user_id: updateRequest.user_id }
          });

          // Jika record tidak ada di database, berikan ResponseError
          if (!checkTaskMustExist) {
               throw new ResponseError(404, "Rejected to update a task", "Task not found");
          }

          // Jika record data ada di database, lakukan proses updated record
          const updateRecordTask: Task = await prismaClient.task.update({
               where: { id: checkTaskMustExist.id, user_id: checkTaskMustExist.user_id }, 
               data: updateRequest
          });

          // Konversi data task dengan rules format yang sesuai
          return convertToTaskResponseOutcome(updateRecordTask);
     }

     public static async deleteTask(deleteRequest: DeleteRequest): Promise<TaskOperationOutcome | ResponseError> {
          // Cek apakah record task ada di database atau tidak, berdasarkan dari task id yang diberikan
          const checkTaskMustExist: Task | null = await prismaClient.task.findFirst({
               where: { id: deleteRequest.taskId, user_id: deleteRequest.userId }
          });

          // Jika record tidak ditemukan, berikan ResponseError
          if (!checkTaskMustExist) {
               throw new ResponseError(404, "Rejected to delete a task", "Task not found");
          }

          // Jika record ada di database, lakukan proses delete record
          const deleteRecordTask: Task = await prismaClient.task.delete({
               where: { id: checkTaskMustExist.id, user_id: checkTaskMustExist.user_id }
          });

          // Konversi data task dengan rules format yang sesuai
          return convertToTaskResponseOutcome(deleteRecordTask);
     }

     public static async filterTasks(filterRequest: FilterRequest): Promise<TaskOperationOutcome[]> {
          // Konversi value string to enum status
          const statusEmumValue: Status = 
               Status[filterRequest.status.toUpperCase() as keyof typeof Status];

          // Jika status query yang diberikan tidak sesuai dengan @Status, berikan ResponseError
          if (!statusEmumValue) {
               throw new ResponseError(404, "Invalid status query parameter", 
                    "The status parameter must be one of the following values: TODO, PROGRESS, COMPLETED");
          }

          // Proses filter tasks berdasarkan status yang diberikan bersama dengan user id
          const filterTaskByStatus: Task[] = await prismaClient.task.findMany({
               where: { user_id: filterRequest.userId, status: statusEmumValue }
          });

          // Jika tidak ada task yang ditemukan, berikan ResponseError
          if (filterTaskByStatus.length < 1) {
               throw new ResponseError(404, "No task found matching the criteria", "Tasks not found");
          }

          // Konversi data tasks dengan rules format yang sesuai
          return filterTaskByStatus.map(record => convertToTaskResponseOutcome(record));
     }

     public static async sortingTasks(sortingRequest: SortingRequest): Promise<TaskOperationOutcome[]> {
          // Proses sorting tasks berdasarkan filter yang ditentukan
          const sortTaskByDueDate: Task[] = await prismaClient.task.findMany({
               where: {
                    AND: [
                         {
                              user_id: sortingRequest.userId, // Cari berdasarkan user id yang diberikan
                         },
                         {
                              dueDate: {
                                   lte: String(Date.now()) // Cari berdasarkan tanggal jatuh tempo yang lebih awal atau sama dengan tanggal sekarang
                              }
                         }
                    ]
               },
               orderBy: [
                    {
                         dueDate: sortingRequest.order // Urutkan tasks berdasarkan dueDate (asc/desc) berdasarkan order yang diberkan default (asc)
                    }
               ]
          });

          // Jika tidak ada task yang ditemukan, berikan ResponseError
          if (sortTaskByDueDate.length < 1) {
               throw new ResponseError(404, "No task found matching the criteria", "Tasks not found");
          }

          // Konversi data tasks dengan rules format yang sesuai
          return sortTaskByDueDate.map(record => convertToTaskResponseOutcome(record));
     }

     public static async assignTask(userId: number): Promise<TaskOperationOutcome | ResponseError> {
          // Cari task pertama yang memenuhi kriteria filter
          const foundTasksInDatabase: Task | null= await prismaClient.task.findFirst({
               where: {
                    AND: [
                         {    
                              user_id: userId, // Cari tasks berdasarkan user id yang diberikan
                         },
                         {
                              dueDate: {
                                   lte: String(Date.now()) // Cari berdasarkan dengan tanggal jatuh tempo yang lebih awal atau sama dengan tanggal sekarang
                              }
                         }
                    ],
                    OR: [
                         {
                              description: {
                                   startsWith: " " // Cari berdasarkan kondisi dengan deskripsi yang dimulai dengan string tertentu
                              }
                         },
                         {
                              status: {
                                   not: "COMPLETED" // @status: Cari task yang statusnya bukan "COMPLETED"
                              }
                         }
                    ]
               }
          });

          // Jika tidak ada task yang ditemukan, berikan ResponseError
          if (!foundTasksInDatabase) {
               throw new ResponseError(404, "No task found matching the criteria", "Task not found")
          }

          // Konversi data task dengan rules format yang sesuai
          return convertToTaskResponseOutcome(foundTasksInDatabase);
     }

}