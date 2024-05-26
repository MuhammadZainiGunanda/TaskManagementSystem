import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";
import { HttpResponseDispatcher } from "../util/sendJsonResponsUtil";

export function errorMiddleware(error: Error, request: Request, response: Response, next: NextFunction): void {
     // Handle jika error adalah ZodError
     if (error instanceof ZodError) {
          const handleIssueZod = error.issues.map(issue => (
               { path: issue.path.join("."), message: issue.message }
          ));

          HttpResponseDispatcher.dispatchJsonResponse(response, 403, "Validation failed. Please check your input.", {}, handleIssueZod);
     }

     // Handle jika error adalah ResponseError
     if (error instanceof ResponseError) {
          HttpResponseDispatcher.dispatchJsonResponse(response, error.status, error.message, {}, error.errors)
     }

     // Berikan response 500 jika sebuah error tidak diketaui
     HttpResponseDispatcher.dispatchJsonResponse(response, 500, "Server erorrs", {}, "Server internal errors");
}