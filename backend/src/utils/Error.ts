export class APIError extends Error {
   public statusCode: number;
   public message:string;
   public actionURL?:string;
   constructor(message:string,statusCode:number,actionURL?:string) {
       super(message);
       this.statusCode = statusCode;
       this.message = message;
       this.actionURL = actionURL;
   }

}