export class ResponseError extends Error {

     public constructor(public status: number, public message: string) {
          super(message);
          this.status = status;
     }

}