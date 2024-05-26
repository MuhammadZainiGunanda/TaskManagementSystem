import { NextFunction, Request, Response } from "express";
import { ChangePasswordRequest, UpdateRequest, UserOperationOutcome } from "../model/user-management";
import { ResponseError } from "../error/response-error";
import { UserService } from "../service/user-service";
import jwt from 'jsonwebtoken';
import { RequestUserValidator } from "../types/request-middleware";
import { ZodError } from "zod";
import { HttpResponseDispatcher } from "../util/sendJsonResponsUtil";

export class UserController {
     public static async submitRegister(request: Request, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk prosess user register dengan mengirim request body yang diberikan
               const submitRegisterConfirmation: UserOperationOutcome | ResponseError | ZodError = 
                    await UserService.register(request.body);

               // Kirim respon sukses dengan status 200 dengan hasil dari proses register
               HttpResponseDispatcher
                    .dispatchJsonResponse(response, 200, "Register successfully", submitRegisterConfirmation, {});
          } catch (error) {
               next(error); // Jika errors, lewatkan error ke middleware selanjutnya
          }
     }

     public static async submitLogin(request: Request, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk proses users login dengan mengirim request body yang diberikan
               const submitUserLoginConfirmation: UserOperationOutcome | ResponseError | ZodError = 
                    await UserService.login(request.body);

               // Buat token JWT dengan data hasil dari proses users login, serta atur kedaluwarsa
               const createToken: string = jwt.sign({ ...submitUserLoginConfirmation }, process.env.TOKEN_SECRET_KEY!, 
                    { expiresIn: process.env.EXPIRES_IN! });

               // Atur cookie dengan token JWT untuk otentikasi
               response.cookie("login", createToken, { httpOnly: true, secure: true, sameSite: "strict" });

               // Kirim respons suksess dengan status 200 dengan hasil dari proses login
               HttpResponseDispatcher
                    .dispatchJsonResponse(response, 200, "User logged in successfully", submitUserLoginConfirmation, {});
          } catch (error) {
               next(error); // Jika errors, lewatkan error ke middleware selanjutnya
          }
     }

     public static async submitGetProfile(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk proses get profile dengan mengirim request user yang diberikan
               const submitGetProfileUserConfirmation: UserOperationOutcome = 
                    await UserService.getProfile(request.user!);

               // Kirim respon sukses dengan status 200 serta hasil dari operasi get profile
               HttpResponseDispatcher
                    .dispatchJsonResponse(response, 200, "User data retrieved successfully", submitGetProfileUserConfirmation, {});
          } catch (error) {
               next(error); // Jika errors, lewatkan error ke middleware selanjutnya
          }
     }

     public static async submitUpdateProfile(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Mengkonstruksi objek UpdateRequest dari request body yang diberikan
               const updateProfileRequest: UpdateRequest = {
                    id: request.user?.id!,
                    ...request.body,
               }

               // Panggil layanan untuk proses update profile dengan mengirim objek UpdateRequest
               const submitUpdateProfileConfirmation: UserOperationOutcome | ZodError = 
                    await UserService.updateProfile(updateProfileRequest);

               // Kirim respon sukses dengan status 200 serta hasil dari operasi update profile
               HttpResponseDispatcher
                    .dispatchJsonResponse(response, 200, "User updated successfully", submitUpdateProfileConfirmation, {});
          } catch (error) {
               console.info(error);
               next(error); // Jika errors, lewatkan error ke middleware selanjutnya
          }
     }

     public static async submitChangePassword(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Mengkonstruksi objek ChangePassword dari request body yang diberikan
               const changePwRequest: ChangePasswordRequest = {
                    userId: request.user?.id!,
                    oldPassword: request.user?.password!,
                    currentPassword: request.body.currentPassword,
                    newPassword: request.body.newPassword
               }
               // Panggil layanan untuk proses update password dengan mengirim objek ChangePassword
               const submitChangePasswordUserConfirmation: UserOperationOutcome | ResponseError | ZodError = 
                    await UserService.changePassword(changePwRequest);

               // Kirim respon sukses dengan status 200 serta hasil dari operasi perubahan password
               HttpResponseDispatcher
                    .dispatchJsonResponse(response, 200, "Password updated successfully", submitChangePasswordUserConfirmation, {});
          } catch (error) {
               next(error); // Jika errors, lewatkan error ke middleware selanjutnya
          }
     }

}