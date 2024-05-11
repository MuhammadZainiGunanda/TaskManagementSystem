import { NextFunction, Request, Response } from "express";
import { UserOperationOutcome } from "../model/user-management";
import { ResponseError } from "../error/response-error";
import { UserService } from "../service/user-service";
import jwt from 'jsonwebtoken';
import { RequestUserValidator } from "../types/request-middleware";
import { ZodError } from "zod";

export class UserController {

     static async submitRegistration(request: Request, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk prosess registration user, dan tunggu konfirmasi
               const submitUserRegistrationConfirmation: UserOperationOutcome | ResponseError | ZodError = 
                    await UserService.registration(request.body);

               // Jika berhasil, kirim respons 200 serta data hasil yang diberikan
               response.status(200).json({ success: true, message: "Register successfully", data: submitUserRegistrationConfirmation });
          } catch (error) {
               next(error); // Jika bermasalah, lewatkan error ke middleware selanjutnya
          }
     }

     static async submitLogin(request: Request, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk prosess login user, dan tunggu konfirmasi
               const submitUserLoginConfirmation: UserOperationOutcome | ResponseError | ZodError = 
                    await UserService.login(request.body);

               // Jika berhasil, buat token JWT dengan data hasil dari konfirmasi login, serta atur kedaluwarsa
               const createToken: string = jwt.sign({ ...submitUserLoginConfirmation }, process.env.TOKEN_SECRET_KEY!, 
                    { expiresIn: process.env.EXPIRES_IN! });

               // Atur cookie dengan token JWT untuk otentikasi
               response.cookie("login", createToken, { httpOnly: true, secure: true, sameSite: "strict" })
               .status(200).json({ success: true, message: "User logged in successfully", data: submitUserLoginConfirmation });
          } catch (error) {
               next(error); // Jika bermasalah, lewatkan error ke middleware selanjutnya
          }
     }

     static async submitGetProfile(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk proses dapatkan data user, dan nunggu konfirmasi
               const submitGetProfileUserConfirmation: UserOperationOutcome = await UserService.getProfile(request.user!);

               // Jika berhasil, kirim respons 200 serta data yang di berikan
               response.status(200).json({ success: true, message: "User data retrieved successfully", data: submitGetProfileUserConfirmation });
          } catch (error) {
               next(error); // Jika bermasalah, lewatkan error ke middleware selanjutnya
          }
     }

     static async submitUpdateProfile(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk proses update data user, dan nunggu konfirmasi
               const submitUpdateUserConfirmation: UserOperationOutcome | ZodError = 
                    await UserService.updateProfile(request.user! ,request.body);

               // Jika berhasil, kirim respons 200 serta data yang telah di update dari konfirmasi
               response.status(200).json({ success: true, message: "User data updated successfully", data: submitUpdateUserConfirmation });
          } catch (error) {
               next(error); // Jika bermasalah, lewatkan error ke middleware selanjutnya
          }
     }

     static async submitChangePassword(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk proses ganti password user, dan nunggu konfirmasi
               const submitChangePasswordUserConfirmation: UserOperationOutcome | ResponseError | ZodError = 
                    await UserService.changePassword(request.user!, request.body);

               // Jika berhasil, kirim response 200 serta data password baru yang telah di update
               response.status(200).json({ success: 200, message: "User password updated successfully", data: submitChangePasswordUserConfirmation });
          } catch (error) {
               next(error); // Jika bermasalah, lewatkan error ke middleware selanjutnya
          }
     }

}