import { AppError } from "../../pkg/error/error.js";

export const userNotExist = new AppError("User does not exist", 404); //404 not found
export const userAlreadyExists = new AppError("User already exists", 409); //409 conflict
export const userVerified = new AppError("User is already verified", 400); // 400 bad request
export const userNotVerified = new AppError("User Must be verifide", 403); //403  forbidden

// class User {
//   userName;
//   email;
//   password;

//   constructor(userName, email, password) {
//     this.userName = userName;
//     this.email = email;
//     this.password = password;
//   } 
// }

// class Customar extends User {
//   address;
//   isVerified;
//   isDeleted;
//   constructor(address, userName, email, password) {
//     super(userName, email, password);
//     this.address = address;
//     this.isVerified = false;
//     this.isDeleted = false;
//   }
// }

// const customar1 = new Customar(
//   "mitghamer",
//   "mtwlii",
//   "mitghamer@gmail.com",
//   "123456",
// );
// const customar2 = new Customar(
//   "mitghamer",
//   "mtwlii",
//   "mitghamer@gmail.com",
//   "123456",
// );

// console.log(customar1);
