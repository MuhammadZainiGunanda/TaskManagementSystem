import { NextFunction, Response } from "express";
import { RequestUserValidator } from "../types/request-middleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "@prisma/client";
import { prismaClient } from "../app/database";

export async function authenticationMiddleware(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
     // Access token dari cookie
     const accessToken: any = request.cookies["login"];

     // Jika token ada
     if (accessToken) {
          try {
               // Dekode token untuk mendapatkan payload
               const decodeToken: string | JwtPayload = jwt.verify(accessToken, process.env.TOKEN_SECRET_KEY!);

               // Melakukan pencarian data user dengan username dari payload token
               const fetchUserByTokenUsername: User | null = await prismaClient.user.findFirst({
                    where: { username: decodeToken.username }
               });

               // Jika data user tidak ditemukan di database, berikan ResponseError
               if (!fetchUserByTokenUsername) {
                    response.status(401).json({ success: false, message: "Access denied", data: {} });
               }

               // Jika data user ditemukan, tambahkan payload user ke dalam objek request dan melanjutkan ke middelware selanjutnya
               request.user = fetchUserByTokenUsername!;
               next();
          } catch (error) {
               // Jika terjadi kesalahan dalam verifikasi token, berikan ResponseError
               response.status(401).json({ success: false, message: "Access denied", data: {} });
          }
     } else {
          // Jika token tidak ada, berikan ResponseError
          response.status(401).json({ success: false, message: "Access denied", data: {} });
     }
}