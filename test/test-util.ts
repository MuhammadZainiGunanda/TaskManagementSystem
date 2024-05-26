import { Task, User } from '@prisma/client';
import { prismaClient } from './../src/app/database';
import bcrypt from 'bcrypt';

export class TestUtil {

     public static async createTestUser(): Promise<void> {
          await prismaClient.user.create({
               data: { 
                    username: "example", email: "example@example.com", 
                    password: await bcrypt.hash("Password123", 10) 
               }
          });
     }

     public static async deleteTestUser(): Promise<void> {
          await prismaClient.user.deleteMany({
               where: { username: "example" }
          });
     }

     public static async getUserTest(): Promise<User | null> {
          return prismaClient.user.findUnique({
               where: { username: "example" }
          });
     }

     public static async createTestTasks(userId: number): Promise<void> {
          await prismaClient.task.create({
               data: {
                    title: "Task 1",
                    description: "Description of Task 1",
                    dueDate: String(Date.now()),
                    status: "COMPLETED",
                    user_id: userId
               }
          });
     }

     public static async deleteTestTask(): Promise<void> {
          await prismaClient.task.deleteMany({
               where: { title: "Task 1" }
          });
     }

     public static async getTaskTest(): Promise<Task | null> {
          return prismaClient.task.findFirst({
               where: { title: "Task 1"}
          });
     }

}