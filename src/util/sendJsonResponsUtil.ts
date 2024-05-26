import { Response } from "express";
import { SendJsonResponse } from "../types/sendJsonResponse";

export class HttpResponseDispatcher {

     public static dispatchJsonResponse <T> (response: Response, status: number, message: string, data: T | {}, errors: T | string | {}): void {
          // Deklarasi var untuk nampung respon JSON yang akan dikirim
          let sendJsonResponse: SendJsonResponse<T>

          // Cek apakah status code adalah status sukses (200 - 299)
          if (status >= 200 && status <= 299) {
               sendJsonResponse = {
                    success: true,
                    message: message,
                    data: data,
                    errors: errors
               }
          } else {
               sendJsonResponse = {
                    success: false,
                    message: message,
                    errors: errors,
                    data: data
               }
          }

          // Kirim respons dengan status code dan objek JSON yang sudah dibuat
          response.status(status).json(sendJsonResponse);
     }

}