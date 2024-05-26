export class ResponseError extends Error {

     public constructor(public status: number, public message: string, public errors: string) {
          super(message);
          this.status = status;
          this.errors = errors;
     }

}