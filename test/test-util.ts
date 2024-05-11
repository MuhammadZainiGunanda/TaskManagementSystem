import { prismaClient } from './../src/app/database';
import bcrypt from 'bcrypt';

export async function deleteTestUser(): Promise<void> {
     await prismaClient.user.deleteMany({
          where: { username: "example" }
     });
}

export async function createTestUser(): Promise<void> {
     await prismaClient.user.create({
          data: { 
               username: "example", email: "example@example.com", 
               password: await bcrypt.hash("Password123", 10) 
          }
     });
}