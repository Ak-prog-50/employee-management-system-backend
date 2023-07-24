import { randomBytes } from "crypto";
import UserModel from "../data-access/models/userModel";
import { TSaveUser } from "../interactors/user.interactor";
import { TRole } from "../types/generalTypes";
import AppError from "../utils/error-handling/AppErrror";
import bcrypt from "bcrypt";
import { protectPwd } from "../utils/pwdHelpers";
// import Employee from "./Employee";
// import HRPerson from "./HRPerson";
// import Manager from "./Manager";

export interface IUserParams {
  empId: number | null;
  name: string;
  contactNo: string;
  email: string;
  age: number;
  designation: string;
  address: string;
  dob: Date;
  appDate: Date;
  role: TRole | null;
}

abstract class User {
  constructor(
    public empId: number | null,
    public name: string,
    public contactNo: string,
    public email: string,
    public age: number,
    public designation: string,
    public address: string,
    public dob: Date,
    public appDate: Date,
    public role: TRole | null,
  ) {}

  private generatePassword(): string {
    const length = 4; // string length will be 8
    const randomBytesBuffer = randomBytes(length);
    return randomBytesBuffer.toString("hex");
    // return randomBytesBuffer;
  }

  async registerEmp(
    userDetails: User,
    saveUser: TSaveUser,
  ): Promise<UserModel | AppError> {
    const HRPerson = (await import("./HRPerson")).default;
    const Manager = (await import("./Manager")).default;
    const Employee = (await import("./Employee")).default;

    const canRegister = this instanceof HRPerson || this instanceof Manager;
    if (canRegister) {
      const employee = new Employee({
        ...userDetails,
        role: "employee",
      });
      const rawPwd = this.generatePassword();
      const protectedPwd = await protectPwd(rawPwd);
      return await saveUser(employee, protectedPwd);
    } else {
      return AppError.notAllowed("User doesn't have permission to register!");
    }
  }
  updateEmp() {}
  deleteEmp() {}
  provideFeedback() {}
}

export default User;
