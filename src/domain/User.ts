import UserModel from "../data-access/models/userModel";
import { TSaveUser } from "../interactors/user.interactor";
import { TRole } from "../types/generalTypes";
import AppError from "../utils/error-handling/AppErrror";
import Employee from "./Employee";
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
  async registerEmp(
    userDetails: User,
    saveUser: TSaveUser,
  ): Promise<UserModel | AppError> {
    const HRPerson = (await import("./HRPerson")).default;
    const Manager = (await import("./Manager")).default;

    const canRegister = this instanceof HRPerson || this instanceof Manager;
    if (canRegister) {
      const employee = new Employee({
        ...userDetails,
        role: "employee",
      });
      return await saveUser(employee);
    } else {
      return AppError.notAllowed("User doesn't have permission to register!");
    }
  }
  updateEmp() {}
  deleteEmp() {}
  provideFeedback() {}
}

export default User;
