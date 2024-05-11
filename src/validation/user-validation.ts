import { ZodType, z } from "zod";

export class UserValidationRules {

     static readonly REGISTRATION_VALIDATION_RULES: ZodType = z.object({
          username: z.string().min(5).max(255),
          email: z.string().email().endsWith(".com"),
          password: z.string().min(5).max(255).regex(/^[A-Za-z].*$/)
     });

     static readonly LOGIN_VALIDATION_RULES: ZodType = z.object({
          email: z.string().email().endsWith(".com"),
          password: z.string().min(5).max(255).regex(/^[A-Za-z].*$/)
     });

     static readonly UPDATE_VALIDATION_RULES: ZodType = z.object({
          username: z.string().min(5).max(255).optional(),
          email: z.string().email().endsWith(".com").optional()
     });

     static readonly CHANGE_PASSWORD_VALIDATION_RULES: ZodType = z.object({
          currentPassword: z.string().min(5).max(255).regex(/^[A-Za-z].*$/),
          newPassword: z.string().min(5).max(255).regex(/^[A-Za-z].*$/)
     });

}