import { ZodType, optional, z } from "zod";

export class TaskValidationRules {

     public static readonly CREATE_TASK_VALIDATION_RULES: ZodType = z.object({
          title: z.string().min(1).max(255),
          description: z.string().max(1000).optional(),
          dueDate: z.string(),
          status: z.enum(["TODO", "PROGRESS", "COMPLETED"])
     });

     public static readonly UPDATED_VALIDATION_RULES: ZodType = z.object({
          id: z.number().positive(),
          title: z.string().min(1).max(255).optional(),
          description: z.string().max(1000).optional(),
          dueDate: z.string(),
          status: z.enum(["TODO", "PROGRESS", "COMPLETED"]).optional()
     });

}