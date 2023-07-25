import { IUserParams } from "../domain/User";

export function isUserParams(obj: any): obj is IUserParams {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.name === "string" &&
    typeof obj.contactNo === "string" &&
    typeof obj.email === "string" &&
    typeof obj.age === "number" &&
    typeof obj.designation === "string" &&
    typeof obj.address === "string" &&
    new Date(obj.dob) instanceof Date &&
    new Date(obj.appDate) instanceof Date &&
    (obj.empId === null || typeof obj.empId === "number") &&
    (obj.role === null || typeof obj.role === "string")
  );
}
