import { User } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { ChangePasswordRequest, LoginRequest, UserOperationOutcome, RegistrationRequest, UpdateRequest, convertToUserResponseOutcome } from "../model/user-management";
import { UserValidationRules } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from 'bcrypt';

export class UserService {

     static async registration(registrationRequest: RegistrationRequest): Promise<UserOperationOutcome> {
          // Lakukan validasi rules
          Validation.validate(UserValidationRules.REGISTRATION_VALIDATION_RULES, registrationRequest);

          // Periksa apakah username yang diberikan sudah ada lebih dahulu di database
          const totalUserWithSameUsername: number = await prismaClient.user.count({
               where: { username: registrationRequest.username }
          });

          // Jika username yang diberikan sudah ada, berikan ResponseError
          if (totalUserWithSameUsername != 0) {
               throw new ResponseError(400, "User already exists");
          }

          // Jika tidak ada masalah, enkripsi password sebelum melakukan saving ke database
          registrationRequest.password = await bcrypt.hash(registrationRequest.password, 10);

          // Buat record user baru dalam database
          const createRecordUser: User = await prismaClient.user.create({
               data: registrationRequest
          });

          // Lakukan konversi record baru, lalu return
          return convertToUserResponseOutcome(createRecordUser);
     }

     static async login(loginRequest: LoginRequest): Promise<UserOperationOutcome> {
          // Lakukan validasi rules
          Validation.validate(UserValidationRules.LOGIN_VALIDATION_RULES, loginRequest);

          // Periksa apakah email yang diberikan ada di database
          const checkUserInDatabase: User | null = await prismaClient.user.findFirst({
               where: { email: loginRequest.email }
          });

          // Jika email yang diberikan tidak ada, berikan ResponseError
          if (!checkUserInDatabase) {
               throw new ResponseError(400, "Email or password is wrong");
          }

          // Periksa apakah password yang diberikan sama dengan password di database
          const checkPasswordIsValid: boolean = await bcrypt.compare(loginRequest.password, checkUserInDatabase.password);

          // Jika password yang diberikan tidak valid, berikan ResponseError
          if (!checkPasswordIsValid) {
               throw new ResponseError(400, "Email or password is wrong");
          }

          // Lakukan konveri data, lalu return
          return convertToUserResponseOutcome(checkUserInDatabase);
     }

     static async getProfile(user: User): Promise<UserOperationOutcome> {
          // Konveri record dan return
          return convertToUserResponseOutcome(user);
     }

     static async updateProfile(user: User, updateRequest: UpdateRequest): Promise<UserOperationOutcome> {
          // Lakukan validasi rules
          Validation.validate(UserValidationRules.UPDATE_VALIDATION_RULES, updateRequest);

          // Jika data username yang diberikan, update payload berdasarkan data yang diberikan
          if (updateRequest.username) {
               user.username = updateRequest.username
          }

          // Jika data email yang diberikan, update payload berdasarkan data yang diberikan
          if (updateRequest.email) {
               user.email = updateRequest.email
          }

          // Updated record dalam database
          const updateRecord: User = await prismaClient.user.update({
               where: { username: user.username }, data: updateRequest
          });

          // Konveri record dari hasil operasi update dan return
          return convertToUserResponseOutcome(updateRecord);
     }

     static async changePassword(user: User, changePasswordRequest: ChangePasswordRequest): Promise<UserOperationOutcome> {
          // Lakukan validasi rules
          Validation.validate(UserValidationRules.CHANGE_PASSWORD_VALIDATION_RULES, changePasswordRequest);

          // Periksa apakah current password yang diberikan sama atau ada di database
          const isCurrentPasswordValid: boolean = await bcrypt.compare(changePasswordRequest.currentPassword, user.password);

          // Jika tidak ada atau tidak memiliki kesamaan, berikan ResponseError
          if (!isCurrentPasswordValid) {
               throw new ResponseError(401, "Incorrect current password");
          }

          // Enkripsi password sebelum melakukan update database
          const newPasswordHash: string = await bcrypt.hash(changePasswordRequest.newPassword, 10);

          // Update record user
          const updatePasswordUser: User = await prismaClient.user.update({
               where: { id: user.id }, data: { password: newPasswordHash }
          });

          // Konveri data dan return
          return convertToUserResponseOutcome(updatePasswordUser);
     }

}