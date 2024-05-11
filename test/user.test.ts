import supertest, { Response } from "supertest";
import { createTestUser, deleteTestUser } from "./test-util";
import { webApplicaiton } from '../src/app/web';

describe("Test registration operations -> POST /api/v1/users/register", (): void => {

     afterEach(async (): Promise<void> => {
          await deleteTestUser();
     });

     it("should to be abel a new user register", async (): Promise<void> => {
          const register: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/register")
               .send({
                    username: "example",
                    email: "example@example.com",
                    password: "Password123"
               });

          console.info(register.body);

          expect(register.statusCode).toBe(200);
          expect(register.body.success).toBeTruthy();
          expect(register.body.message).toBe("Register successfully");
          expect(register.body.data.username).toBe("example");
          expect(register.body.data.email).toBe("example@example.com");
     });

     it("should reject if data is invalid, register test", async (): Promise<void> => {
          const register: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/register")
               .send({
                    username: "",
                    email: "",
                    password: ""
               });

          console.info(register.body);

          expect(register.statusCode).toBe(403);
          expect(register.body.success).toBeFalsy();
          expect(register.body.message).toBeDefined();
          expect(register.body.errors).toBeDefined();
     });

     it("should reject if username is already exitst", async (): Promise<void> => {
          let register: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/register")
               .send({
                    username: "example",
                    email: "example@example.com",
                    password: "Password123"
               });

          console.info(register.body);

          expect(register.statusCode).toBe(200);
          expect(register.body.success).toBeTruthy();
          expect(register.body.message).toBe("Register successfully");
          expect(register.body.data.username).toBe("example");
          expect(register.body.data.email).toBe("example@example.com");

          register = await supertest(webApplicaiton)
               .post("/api/v1/users/register")
               .send({
                    username: "example",
                    email: "example@example.com",
                    password: "Password123"
               });
          
          console.info(register.body);
          
          expect(register.statusCode).toBe(400);
          expect(register.body.success).toBeFalsy();
          expect(register.body.message).toBeDefined();
     });

});

describe("Test login operations -> POST /api/v1/users/login", () => {

     beforeEach(async (): Promise<void> => {
          await createTestUser();
     });

     afterEach(async (): Promise<void> => {
          await deleteTestUser();
     });

     it("should to be able user login", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Password123"
               });
          
          console.info(login.body);
          console.info(login.headers["set-cookie"][0]);

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.success).toBeTruthy();
          expect(login.body.message).toBeDefined();
          expect(login.body.data.username).toBe("example");
          expect(login.body.data.email).toBe("example@example.com");
     });

     it("should reject if data is invalid, login test", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "",
                    password: ""
               });

          console.info(login.body);

          expect(login.statusCode).toBe(403);
          expect(login.body.success).toBeFalsy();
          expect(login.body.message).toBeDefined();
          expect(login.body.errors).toBeDefined();
     });

     it("should reject if password is wrong, login test", async (): Promise<void> => {
          const login: Response = await supertest(webApplicaiton)
               .post("/api/v1/users/login")
               .send({
                    email: "example@example.com",
                    password: "Salah123"
               });

          console.info(login.body);

          expect(login.statusCode).toBe(400);
          expect(login.body.success).toBeFalsy();
          expect(login.body.message).toBeDefined();
     });

});

describe("Test get operation -> GET /api/v1/users/me/", (): void => {

     beforeEach(async (): Promise<void> => {
          await createTestUser();
     });

     afterEach(async (): Promise<void> => {
          await deleteTestUser();
     });

     it("should can to get user", async (): Promise<void> => {
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
               .get("/api/v1/users/me")
               .set("Cookie", `${token}`)

          console.info(get.body);

          expect(get.statusCode).toBe(200);
          expect(get.body.success).toBeTruthy();
          expect(get.body.message).toBeDefined();
          expect(get.body.data.username).toBe("example");
          expect(get.body.data.email).toBe("example@example.com");
     });

     it("should reject if token is invalid, get test", async (): Promise<void> => {
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
               .get("/api/v1/users/me")
               .set("Cookie", `salah`)

          console.info(get.body);

          expect(get.statusCode).toBe(401);
          expect(get.body.success).toBeFalsy();
          expect(get.body.message).toBeDefined();
     });

});

describe("Test update operastions -> PUT /api/v1/users/me", (): void => {

     beforeEach(async (): Promise<void> => {
          await createTestUser();
     });

     afterEach(async (): Promise<void> => {
          await deleteTestUser();
     });

     it("should to be abel update user data", async (): Promise<void> => {
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

          const update: Response = await supertest(webApplicaiton)
               .put("/api/v1/users/me")
               .set("Cookie", `${token}`)
               .send({
                    username: "newusername",
                    email: "newemail@example.com"
               });

          console.info(update.body);

          expect(update.statusCode).toBe(200);
          expect(update.body.success).toBeTruthy();
          expect(update.body.message).toBeDefined();
          expect(update.body.data.username).toBe("newusername");
          expect(update.body.data.email).toBe("newemail@example.com");
     });

     it("should reject if data is invalid, update test", async (): Promise<void> => {
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

          const update: Response = await supertest(webApplicaiton)
               .put("/api/v1/users/me")
               .set("Cookie", `${token}`)
               .send({
                    username: "",
                    email: ""
               });

          console.info(update.body);

          expect(update.statusCode).toBe(403);
          expect(update.body.success).toBeFalsy();
          expect(update.body.message).toBeDefined();
          expect(update.body.errors).toBeDefined();
     });

     it("should reject if token is wrong, update test", async (): Promise<void> => {
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

          const update: Response = await supertest(webApplicaiton)
               .put("/api/v1/users/me")
               .set("Cookie", `salah`)
               .send({
                    username: "newusername",
                    email: "newemail@example@gmail.com"
               });

          console.info(update.body);

          expect(update.statusCode).toBe(401);
          expect(update.body.success).toBeFalsy();
          expect(update.body.message).toBeDefined();
     });

});

describe("Test change password operation -> PUT /api/v1/users/change-password", (): void => {

     beforeEach(async (): Promise<void> => {
          await createTestUser();
     });

     afterEach(async (): Promise<void> => {
          await deleteTestUser();
     });

     it("should can change password user", async (): Promise<void> => {
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

          const changPassword: Response = await supertest(webApplicaiton)
               .put("/api/v1/users/change-password")
               .set("Cookie", `${token}`)
               .send({
                    currentPassword: "Password123",
                    newPassword: "Newpassword456"
               });

          console.info(changPassword.body);

          expect(changPassword.statusCode).toBe(200);
          expect(changPassword.body.success).toBeTruthy();
          expect(changPassword.body.message).toBeDefined();
          expect(changPassword.body.data.username).toBe("example");
          expect(changPassword.body.data.email).toBe("example@example.com");
     });

     it("should reject current passwrod is wrong", async (): Promise<void> => {
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

          const changPassword: Response = await supertest(webApplicaiton)
               .put("/api/v1/users/change-password")
               .set("Cookie", `${token}`)
               .send({
                    currentPassword: "Salah123",
                    newPassword: "Newpassword456"
               });

          console.info(changPassword.body);

          expect(changPassword.statusCode).toBe(400);
          expect(changPassword.body.success).toBeFalsy();
          expect(changPassword.body.message).toBe("Incorrect current password");
     });

     it("should reject if data is invalid, change password test", async (): Promise<void> => {
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

          const changPassword: Response = await supertest(webApplicaiton)
               .put("/api/v1/users/change-password")
               .set("Cookie", `${token}`)
               .send({
                    currentPassword: "",
                    newPassword: ""
               });

          console.info(changPassword.body);

          expect(changPassword.statusCode).toBe(403);
          expect(changPassword.body.success).toBeFalsy();
          expect(changPassword.body.message).toBeDefined();
          expect(changPassword.body.errors).toBeDefined();
     });

     it("should reject if token is invalid, change password test", async (): Promise<void> => {
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

          const changPassword: Response = await supertest(webApplicaiton)
               .put("/api/v1/users/change-password")
               .set("Cookie", `Salah`)
               .send({
                    currentPassword: "Password123",
                    newPassword: "Newpassword456"
               });

          console.info(changPassword.body);

          expect(changPassword.statusCode).toBe(401);
          expect(changPassword.body.success).toBeFalsy();
          expect(changPassword.body.message).toBeDefined();
     });

});