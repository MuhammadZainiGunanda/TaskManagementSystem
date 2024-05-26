import { Task, Status, Prisma } from "@prisma/client";

// Representasi rules format out come operasi tasks
export type TaskOperationOutcome = {
     id: number;
     title: string;
     description: string;
     dueDate: number;
     status: Status;
}

// Request untuk create task
export type CreateRequest = {
     title: string;
     description: string;
     dueDate: string;
     status: Status;
     user_id: number;
}

// Request untuk update task
export type UpdateRequest = {
     id: number;
     title?: string;
     description?: string;
     dueDate: string;
     status?: Status;
     user_id: number;
}

// Request untuk delete task
export type DeleteRequest = {
     userId: number;
     taskId: number;
}

// Request untuk filter task
export type FilterRequest = {
     userId: number;
     status: string;
}

// Request untuk sorting task
export type SortingRequest = {
     userId: number
     sortBy: string;
     order?: Prisma.SortOrder;
}

// Representasi untuk konversi task payload, ke format yang sesuai
export function convertToTaskResponseOutcome(task: Task): TaskOperationOutcome {
     return { 
          id: task.id, title: task.title, description: task.description!, 
          dueDate: Number(task.dueDate), status: task.status 
     }
}