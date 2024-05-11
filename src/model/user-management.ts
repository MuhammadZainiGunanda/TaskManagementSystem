import { User } from "@prisma/client";

// Representasi hasil operasi terkait user
export type UserOperationOutcome = {
     username: string;
     email: string;
}

// Request untuk user register
export type RegistrationRequest = {
     username: string;
     email: string;
     password: string;
}

// Request untuk user login
export type LoginRequest = {
     email: string;
     password: string;
}

// Request untuk user update
export type UpdateRequest = {
     username: string;
     email: string;
}

// Request untuk ganti password
export type ChangePasswordRequest = {
     currentPassword: string;
     newPassword: string;
}

// Representasi untuk konversi user payload, menjadi hasil operasi user
export function convertToUserResponseOutcome(userPayload: User): UserOperationOutcome {
     return { username: userPayload.username, email: userPayload.email };
}