export type SendJsonResponse<T> = {
     success: boolean;
     message: string;
     data: T | {};
     errors: T | {} | string;
}