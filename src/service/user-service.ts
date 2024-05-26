import { User } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { ChangePasswordRequest, LoginRequest, UserOperationOutcome, RegisterRequest, UpdateRequest, convertToUserResponseOutcome } from "../model/user-management";
import { UserValidationRules } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from 'bcrypt';
import { ZodError } from "zod";

export class UserService {

     public static async register(registerRequest: RegisterRequest): Promise<UserOperationOutcome | ResponseError | ZodError> {
          // Proses validasi register
          Validation.validate(UserValidationRules.REGISTRATION_VALIDATION_RULES, registerRequest);

          // Cek apakah username yang diberikan sudah ada lebih dahulu di database
          const totalUserWithSameUsername: number = await prismaClient.user.count({
               where: { username: registerRequest.username }
          });

          // Jika username yang diberikan sudah ada, berikan ResponseError
          if (totalUserWithSameUsername != 0) {
               throw new ResponseError(400, "Rejected to create a User", "User already exists");
          }

          // Buat record user baru dalam database
          const createRecordUser: User = await prismaClient.user.create({
               data: { ...registerRequest, password: await bcrypt.hash(registerRequest.password, 10) }
          });

          // Konversi data user dengan rules format yang sesuai
          return convertToUserResponseOutcome(createRecordUser);
     }

     public static async login(loginRequest: LoginRequest): Promise<UserOperationOutcome | ResponseError | ZodError> {
          // Proses validasi login
          Validation.validate(UserValidationRules.LOGIN_VALIDATION_RULES, loginRequest);

          // Cek apakah email yang diberikan ada di database
          const checkUserInDatabase: User | null = await prismaClient.user.findFirst({
               where: { email: loginRequest.email }
          });

          // Jika email yang diberikan tidak ada, berikan ResponseError
          if (!checkUserInDatabase) {
               throw new ResponseError(400, "Rejected to a login user", "Email or password is wrong");
          }

          // Cek apakah password yang diberikan sama dengan password di database
          const checkPasswordIsValid: boolean = await bcrypt.compare(loginRequest.password, checkUserInDatabase.password);

          // Jika password yang diberikan tidak valid, berikan ResponseError
          if (!checkPasswordIsValid) {
               throw new ResponseError(400, "Rejected to a login user", "Email or password is wrong");
          }

          // Konversi data user dengan rules format yang sesuai
          return convertToUserResponseOutcome(checkUserInDatabase);
     }

     public static async getProfile(user: User): Promise<UserOperationOutcome> {
          // Konversi data user dengan rules format yang sesuai
          return convertToUserResponseOutcome(user);
     }

     public static async updateProfile(updateRequest: UpdateRequest): Promise<UserOperationOutcome | ZodError> {
          // Lakukan validasi update
          Validation.validate(UserValidationRules.UPDATE_VALIDATION_RULES, updateRequest);

          // Updated record dalam database
          const updateRecord: User = await prismaClient.user.update({
               where: { id: updateRequest.id }, data: updateRequest
          });

          // Konversi data user dengan rules format yang sesuai
          return convertToUserResponseOutcome(updateRecord);
     }

     public static async changePassword(changePasswordRequest: ChangePasswordRequest): Promise<UserOperationOutcome | ResponseError | ZodError> {
          // Lakukan validasi change password
          Validation.validate(UserValidationRules.CHANGE_PASSWORD_VALIDATION_RULES, changePasswordRequest);

          // Cek apakah current password yang diberikan sama atau ada di database
          const isCurrentPasswordValid: boolean = await bcrypt.compare(changePasswordRequest.currentPassword, changePasswordRequest.oldPassword);

          // Jika tidak ada atau tidak memiliki kesamaan, berikan ResponseError
          if (!isCurrentPasswordValid) {
               throw new ResponseError(401, "Rejected to change password", "Incorrect current password");
          }

          // Update record user
          const updatePasswordUser: User = await prismaClient.user.update({
               where: { id: changePasswordRequest.userId }, 
               data: { password: await bcrypt.hash(changePasswordRequest.newPassword, 10) }
          });

          // Konversi data user dengan rules format yang sesuai
          return convertToUserResponseOutcome(updatePasswordUser);
     }

}