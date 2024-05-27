import { webApplicaiton } from './../src/app/web';
import supertest, { Response } from "supertest";
import { TestUtil } from "./test-util";
import { Task, User } from '@prisma/client';

describe("Test create Task operation -> Post /api/v1/tasks", (): void => {

     beforeEach(async (): Promise<void> => {
          await TestUtil.createTestUser();
     });

     afterEach(async (): Promise<void> => {
          await TestUtil.deleteTestTask();
          await TestUtil.deleteTestUser();
     });

     it("should to be able a new task", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const create: Response = await supertest(webApplicaiton)
               .post("/api/v1/tasks")
               .set("Cookie", `${token}`)
               .send({
                    title: "Task 1",
                    description: "Description of Task 1",
                    dueDate: String(Date.now()),
                    status: "TODO"
               });

          console.info(create.body);

          expect(create.statusCode).toBe(200);
          expect(create.body.success).toBeTruthy();
          expect(create.body.message).toBeDefined();
          expect(create.body.data.id).toBeDefined();
          expect(create.body.data.title).toBeDefined();
          expect(create.body.data.description).toBeDefined();
          expect(create.body.data.dueDate).toBeDefined();
          expect(create.body.data.status).toBeDefined();
          expect(create.body.errors.message).toBeUndefined();
     });

     it("should reject if data is invalid, create task operation", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const create: Response = await supertest(webApplicaiton)
               .post("/api/v1/tasks")
               .set("Cookie", `${token}`)
               .send({
                    title: "",
                    description: "",
                    dueDate: "",
                    status: ""
               });

          console.info(create.body);

          expect(create.statusCode).toBe(403);
          expect(create.body.success).toBeFalsy();
          expect(create.body.message).toBeDefined();
          expect(create.body.errors).toBeDefined();
          expect(create.body.data.data).toBeUndefined()
     });

     it("should reject if token is invalid, create task operation", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const create: Response = await supertest(webApplicaiton)
               .post("/api/v1/tasks")
               .set("Cookie", `salah`)
               .send({
                    title: "Task 1",
                    description: "Description of Task 1",
                    dueDate: String(Date.now()),
                    status: "TODO"
               });

          console.info(create.body);

          expect(create.statusCode).toBe(401);
          expect(create.body.success).toBeFalsy();
          expect(create.body.message).toBeDefined();
          expect(create.body.errors).toBeDefined();
          expect(create.body.data.data).toBeUndefined();
     });

});

describe("Test get all tasks operation -> GET /api/v1/users/:userId(\\d+)/tasks", (): void => {

     beforeEach(async (): Promise<void> => {
          await TestUtil.createTestUser();

          const getUser: User | null = await TestUtil.getUserTest();
          for (let i = 1; i <= 10; i++) {
               await TestUtil.createTestTasks(getUser?.id!);
          }
     });

     afterEach(async (): Promise<void> => {
          await TestUtil.deleteTestTask();
          await TestUtil.deleteTestUser();
     });

     it("should to be able get all tasks operation", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const get: Response = await supertest(webApplicaiton)
               .get(`/api/v1/tasks`)
               .set("Cookie", `${token}`);

          console.info(get.body);

          expect(get.statusCode).toBe(200);
          expect(get.body.success).toBeTruthy();
          expect(get.body.message).toBeDefined();
          expect(get.body.data).toHaveLength(10);
          expect(get.body.errors.error).toBeUndefined();
     });

     it("should reject if user id is not have tasks, get all operation", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const get: Response = await supertest(webApplicaiton)
               .get(`/api/v1/tasks`)
               .set("Cookie", `${token}`);

          console.info(get.body);

          expect(get.statusCode).toBe(404);
          expect(get.body.success).toBeFalsy();
          expect(get.body.message).toBeDefined();
          expect(get.body.errors).toBeDefined();
          expect(get.body.data.data).toBeUndefined();
     });

     it("should reject if token is invalid, get all task operation", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];
          const getUser: User | null = await TestUtil.getUserTest();

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const get: Response = await supertest(webApplicaiton)
               .get(`/api/v1/tasks`)
               .set("Cookie", `salah`);

          console.info(get.body);

          expect(get.statusCode).toBe(401);
          expect(get.body.success).toBeFalsy();
          expect(get.body.message).toBeDefined();
          expect(get.body.errors).toBeDefined();
          expect(get.body.data.data).toBeUndefined();
     });

});

describe("Test get task by ID operations -> GET /api/v1/tasks/:taksId(\\d+)", (): void => {

     beforeEach(async (): Promise<void> => {
          await TestUtil.createTestUser();

          const getUser: User | null = await TestUtil.getUserTest();
          await TestUtil.createTestTasks(getUser?.id!);
     });

     afterEach(async (): Promise<void> => {
          await TestUtil.deleteTestTask();
          await TestUtil.deleteTestUser();
     });

     it("should can get task by ID", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];
          const getTask: Task | null = await TestUtil.getTaskTest();

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const getByID: Response = await supertest(webApplicaiton)
               .get(`/api/v1/tasks/${getTask?.id}`)
               .set("Cookie", `${token}`)

          console.info(getByID.body);

          expect(getByID.statusCode).toBe(200);
          expect(getByID.body.success).toBeTruthy();
          expect(getByID.body.message).toBeDefined();
          expect(getByID.body.data.id).toBeDefined();
          expect(getByID.body.data.title).toBeDefined();
          expect(getByID.body.data.description).toBeDefined();
          expect(getByID.body.data.dueDate).toBeDefined();
          expect(getByID.body.data.status).toBeDefined();
          expect(getByID.body.errors.error).toBeUndefined();
     });

     it("should reject if token is invalid, get by id operation", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];
          const getTask: Task | null = await TestUtil.getTaskTest();

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          if (getTask) {
               const getByID: Response = await supertest(webApplicaiton)
                    .get(`/api/v1/tasks/${getTask?.id}`)
                    .set("Cookie", `SALAH`)

               console.info(getByID.body);

               expect(getByID.statusCode).toBe(401);
               expect(getByID.body.success).toBeFalsy();
               expect(getByID.body.message).toBeDefined();
               expect(getByID.body.errors).toBeDefined();
               expect(getByID.body.data.data).toBeUndefined();
          }
     });

     it("should reject if token is invalid, get by id operation", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];
          const getTask: Task | null = await TestUtil.getTaskTest();

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          if (getTask) {
               const getByID: Response = await supertest(webApplicaiton)
               .get(`/api/v1/tasks/${getTask?.id + 1}`)
               .set("Cookie", `${token}`)

               console.info(getByID.body);

               expect(getByID.statusCode).toBe(404);
               expect(getByID.body.success).toBeFalsy();
               expect(getByID.body.message).toBeDefined();
               expect(getByID.body.errors).toBeDefined();
               expect(getByID.body.data.data).toBeUndefined();
          }
     });

});

describe("Test update task operation -> PUT /api/v1/tasks/:taskId(\\d+)", (): void => {
     
     beforeEach(async (): Promise<void> => {
          await TestUtil.createTestUser();

          const getUser: User | null = await TestUtil.getUserTest();
          await TestUtil.createTestTasks(getUser?.id!);
     });

     afterEach(async (): Promise<void> => {
          await TestUtil.deleteTestTask();
          await TestUtil.deleteTestUser();
     });

     it("should can updated data task by ID", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];
          const getTask: Task | null = await TestUtil.getTaskTest();

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const update: Response = await supertest(webApplicaiton)
               .put(`/api/v1/tasks/${getTask?.id}`)
               .set("Cookie", `${token}`)
               .send({
                    title: "Task 1",
                    description: "New decscripton of Task 1",
                    dueDate: String(Date.now()),
                    status: "PROGRESS"
               });

          console.info(update.body);

          expect(update.statusCode).toBe(200);
          expect(update.body.success).toBeTruthy();
          expect(update.body.message).toBeDefined();
          expect(update.body.data.id).toBeDefined();
          expect(update.body.data.title).toBeDefined();
          expect(update.body.data.description).toBeDefined();
          expect(update.body.data.dueDate).toBeDefined();
          expect(update.body.data.status).toBeDefined();
          expect(update.body.errors.error).toBeUndefined();
     });

     it("should reject if task id is invaldi, update task operation", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];
          const getTask: Task | null = await TestUtil.getTaskTest();

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          if (getTask) {
               const update: Response = await supertest(webApplicaiton)
                    .put(`/api/v1/tasks/${getTask?.id + 1}`)
                    .set("Cookie", `${token}`)
                    .send({
                         title: "Task 1",
                         description: "New decscripton of Task 1",
                         dueDate: String(Date.now()),
                         status: "PROGRESS"
                    });

               console.info(update.body);

               expect(update.statusCode).toBe(404);
               expect(update.body.success).toBeFalsy();
               expect(update.body.message).toBeDefined();
               expect(update.body.errors).toBeDefined();
               expect(update.body.data.data).toBeUndefined()
          }
     });

     it("should reject if data is invalid, update task operation", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];
          const getTask: Task | null = await TestUtil.getTaskTest();

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          if (getTask) {
               const update: Response = await supertest(webApplicaiton)
                    .put(`/api/v1/tasks/${getTask?.id + 1}`)
                    .set("Cookie", `${token}`)
                    .send({
                         title: "",
                         description: "",
                         dueDate: "",
                         status: ""
                    });

               console.info(update.body);

               expect(update.statusCode).toBe(403);
               expect(update.body.success).toBeFalsy();
               expect(update.body.message).toBeDefined();
               expect(update.body.errors).toBeDefined();
               expect(update.body.data.data).toBeUndefined();
          }
     });

     it("should reject if token invalid, update task operation", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];
          const getTask: Task | null = await TestUtil.getTaskTest();

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          if (getTask) {
               const update: Response = await supertest(webApplicaiton)
                    .put(`/api/v1/tasks/${getTask?.id}`)
                    .set("Cookie", `salah`)
                    .send({
                         title: "Task 1",
                         description: "New decscripton of Task 1",
                         dueDate: String(Date.now()),
                         status: "PROGRESS"
                    });

               console.info(update.body);

               expect(update.statusCode).toBe(401);
               expect(update.body.success).toBeFalsy();
               expect(update.body.message).toBeDefined();
               expect(update.body.errros).toBeDefined();
               expect(update.body.data.data).toBeUndefined();
          }
     });

});

describe("Test delete Task operation -> DELETE /api/v1/tasks/:taskId(\\d+)", (): void => {

     beforeEach(async (): Promise<void> => {
          await TestUtil.createTestUser();

          const getUser: User | null = await TestUtil.getUserTest();
          await TestUtil.createTestTasks(getUser?.id!)
     });

     afterEach(async (): Promise<void> => {
          await TestUtil.deleteTestTask();
          await TestUtil.deleteTestUser();
     });

     it("should to be able delete Task", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];
          const getTask: Task | null = await TestUtil.getTaskTest();

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const remove: Response = await supertest(webApplicaiton)
               .delete(`/api/v1/tasks/${getTask?.id}`)
               .set("Cookie", `${token}`)

          console.info(remove.body);

          expect(remove.statusCode).toBe(200);
          expect(remove.body.success).toBeTruthy();
          expect(remove.body.message).toBeDefined();
          expect(remove.body.data).toBeDefined();
          expect(remove.body.errors.error).toBeUndefined();
     });

     it("should reject if task id invalid, delete task operation", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];
          const getTask: Task | null = await TestUtil.getTaskTest();

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          if (getTask) {
               const remove: Response = await supertest(webApplicaiton)
                    .delete(`/api/v1/tasks/${getTask?.id + 1}`)
                    .set("Cookie", `${token}`)

               console.info(remove.body);

               expect(remove.statusCode).toBe(404);
               expect(remove.body.success).toBeFalsy();
               expect(remove.body.message).toBeDefined();
               expect(remove.body.errors).toBeDefined();
               expect(remove.body.data.data).toBeUndefined();
          }
     });

     it("should reject if token is invalid, delete task operation", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];
          const getTask: Task | null = await TestUtil.getTaskTest();

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          if (getTask) {
               const remove: Response = await supertest(webApplicaiton)
                    .delete(`/api/v1/tasks/${getTask?.id + 1}`)
                    .set("Cookie", `salah`)

               console.info(remove.body);

               expect(remove.statusCode).toBe(401);
               expect(remove.body.success).toBeFalsy();
               expect(remove.body.message).toBeDefined();
               expect(remove.body.errors).toBeDefined();
               expect(remove.body.data.data).toBeUndefined();
          }
     });

});

describe("Test filter Task operation, GET -> /api/v1/task/filter", (): void => {

     beforeEach(async (): Promise<void> => {
          await TestUtil.createTestUser();

          const getUser: User | null = await TestUtil.getUserTest();
          for (let i = 1; i <= 10; i++) {
               await TestUtil.createTestTasks(getUser?.id!)
          }
     });

     afterEach(async (): Promise<void> => {
          await TestUtil.deleteTestTask();
          await TestUtil.deleteTestUser();
     });

     it("should to be able a filter task by status TODO", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const filter: Response = await supertest(webApplicaiton)
               .get("/api/v1/tasks/filter")
               .query({ status: "TODO"})
               .set("Cookie", `${token}`)

          console.info(filter.body);

          expect(filter.statusCode).toBe(200);
          expect(filter.body.success).toBeTruthy();
          expect(filter.body.message).toBeDefined();
          expect(filter.body.data).toHaveLength(10);
          expect(filter.body.errors.error).toBeUndefined();
     });

     it("should to be able a filter task by status PROGRESS", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const filter: Response = await supertest(webApplicaiton)
               .get("/api/v1/tasks/filter")
               .query({ status: "PROGRESS"})
               .set("Cookie", `${token}`)

          console.info(filter.body);

          expect(filter.statusCode).toBe(200);
          expect(filter.body.success).toBeTruthy();
          expect(filter.body.message).toBeDefined();
          expect(filter.body.data).toHaveLength(10);
          expect(filter.body.errors.error).toBeUndefined();
     });

     it("should to be able a filter task by status COMPLETED", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const filter: Response = await supertest(webApplicaiton)
               .get("/api/v1/tasks/filter")
               .query({ status: "COMPLETED"})
               .set("Cookie", `${token}`)

          console.info(filter.body);

          expect(filter.statusCode).toBe(200);
          expect(filter.body.success).toBeTruthy();
          expect(filter.body.message).toBeDefined();
          expect(filter.body.data).toHaveLength(10);
          expect(filter.body.errors.error).toBeUndefined();
          
     });

     it("should reject if data query is invalid", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const filter: Response = await supertest(webApplicaiton)
               .get("/api/v1/tasks/filter")
               .query({ status: "SALAH"})
               .set("Cookie", `${token}`)

          console.info(filter.body);

          expect(filter.statusCode).toBe(404);
          expect(filter.body.success).toBeFalsy();
          expect(filter.body.message).toBeDefined();
          expect(filter.body.errors).toBeDefined();
          expect(filter.body.data.data).toBeUndefined();
     });

});

describe("Test sorting Task operation -> GET /api/v1/tasks", (): void => {

     beforeEach(async (): Promise<void> => {
          await TestUtil.createTestUser();

          for (let i = 1; i <= 10; i++) {
               const getUser: User | null = await TestUtil.getUserTest();
               await TestUtil.createTestTasks(getUser?.id!)
          }
     });

     afterEach(async (): Promise<void> => {
          await TestUtil.deleteTestTask();
          await TestUtil.deleteTestUser();
     });

     it("should to be able to sort Task", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const sortTask: Response = await supertest(webApplicaiton)
               .get("/api/v1/tasks")
               .set("Cookie", `${token}`);

          console.info(sortTask.body);

          expect(sortTask.statusCode).toBe(200);
          expect(sortTask.body.success).toBeTruthy();
          expect(sortTask.body.message).toBeDefined();
          expect(sortTask.body.data).toHaveLength(10);
          expect(sortTask.body.errors.error).toBeUndefined();
     });

     it("should to be able to sort Task by order desc", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const sortTask: Response = await supertest(webApplicaiton)
               .get("/api/v1/tasks")
               .query({ order: "desc"})
               .set("Cookie", `${token}`);

          console.info(sortTask.body);

          expect(sortTask.statusCode).toBe(200);
          expect(sortTask.body.success).toBeTruthy();
          expect(sortTask.body.message).toBeDefined();
          expect(sortTask.body.data).toHaveLength(10);
          expect(sortTask.body.errors.error).toBeUndefined();
     });

     it("should reject if token is invalid, sorted task operation", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const sortTask: Response = await supertest(webApplicaiton)
               .get("/api/v1/tasks")
               .query({ order: "desc"})
               .set("Cookie", `SALAH`);

          console.info(sortTask.body);

          expect(sortTask.statusCode).toBe(401);
          expect(sortTask.body.success).toBeFalsy();
          expect(sortTask.body.message).toBeDefined();
          expect(sortTask.body.errors).toBeDefined();
          expect(sortTask.body.data.data).toBeUndefined();
     });

});

describe("Test assign task operation -> Get /api/v1/tasks/:taskId(\\d+)", (): void => {

     beforeEach(async (): Promise<void> => {
          await TestUtil.createTestUser();

          const getUser: User | null = await TestUtil.getUserTest();
          await TestUtil.createTestTasks(getUser?.id!)
     });

     afterEach(async (): Promise<void> => {
          await TestUtil.deleteTestTask();
          await TestUtil.deleteTestUser();
     });

     it("should to be able a assing taks by id", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
     
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const assignTask: Response = await supertest(webApplicaiton)
               .get(`/api/v1/tasks/assign`)
               .set("Cookie", `${token}`)

          console.info(assignTask.body);

          expect(assignTask.statusCode).toBe(200);
          expect(assignTask.body.success).toBeTruthy();
          expect(assignTask.body.message).toBeDefined();
          expect(assignTask.body.data).toBeDefined();
     });

     it("should to be able a assing taks by id", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
     
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const assignTask: Response = await supertest(webApplicaiton)
               .get(`/api/v1/tasks/assign`)
               .set("Cookie", `${token}`)

          console.info(assignTask.body);

          expect(assignTask.statusCode).toBe(200);
          expect(assignTask.body.success).toBeTruthy();
          expect(assignTask.body.message).toBeDefined();
          expect(assignTask.body.data).toBeDefined();
     });

     it("should reject if userId is not have taks", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
     
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const assignTask: Response = await supertest(webApplicaiton)
               .get(`/api/v1/tasks/assign`)
               .set("Cookie", `${token}`)

          console.info(assignTask.body);

          expect(assignTask.statusCode).toBe(404);
          expect(assignTask.body.success).toBeFalsy();
          expect(assignTask.body.message).toBeDefined();
          expect(assignTask.body.errors).toBeDefined();
          expect(assignTask.body.data.data).toBeUndefined();
     });

     it("should reject if token is invalid, assign task operation", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
     
          const token: string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");

          const assignTask: Response = await supertest(webApplicaiton)
               .get(`/api/v1/tasks/assign`)
               .set("Cookie", `SALAH`)

          console.info(assignTask.body);

          expect(assignTask.statusCode).toBe(401);
          expect(assignTask.body.success).toBeFalsy();
          expect(assignTask.body.message).toBeDefined();
          expect(assignTask.body.errors).toBeDefined();
          expect(assignTask.body.data.data).toBeUndefined();
     });

});