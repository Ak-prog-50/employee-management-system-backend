import { randomBytes } from "crypto";
import UserModel from "../data-access/models/user.model";
import { TSaveUser } from "../interactors/user.interactor";
import { TRole } from "../types/generalTypes";
import AppError from "../utils/error-handling/AppErrror";
import { protectPwd } from "../utils/pwdHelpers"; //todo: inject from controller
import { notifyRegistrant } from "../services/emailService"; //todo: inject from controller
import { findAndApprove } from "../data-access/registrationReq.db"; // todo: inject from controller
import { TfetchRegistrationRequestsList } from "../interactors/registrationReq.interactor";
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
    public appDate: Date, /// appointed date
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
    //todo: data layer functions and service calls in interactor layer?

    const HRPerson = (await import("./HRPerson")).default;
    const Manager = (await import("./Manager")).default;
    const Employee = (await import("./Employee")).default;

    const canRegister = this instanceof HRPerson || this instanceof Manager;
    if (canRegister) {
      const employee = new Employee({
        ...userDetails,
        age: 0, // age doesn't matter. will be derived.
        role: "employee",
      });
      const rawPwd = this.generatePassword();
      const protectedPwd = await protectPwd(rawPwd);
      const pendingRegistraion = await findAndApprove(employee.email);
      if (pendingRegistraion === true) {
        const savedUser = await saveUser(employee, protectedPwd);
        await notifyRegistrant(employee.email, rawPwd);
        return savedUser;
      } else if (pendingRegistraion === false) {
        return AppError.notFound("No pending registration found!");
      } else return pendingRegistraion;
    } else {
      return AppError.notAllowed("User doesn't have permission to register!");
    }
  }

  async viewRegistrationRequests(
    fetchRegistrationRequestsList: TfetchRegistrationRequestsList,
  ) {
    //todo: data layer functions and service calls to interactor layer?
    const HRPerson = (await import("./HRPerson")).default; // WET
    const Manager = (await import("./Manager")).default;
    const canView = this instanceof HRPerson || this instanceof Manager;

    if (canView) {
      const allRequests = await fetchRegistrationRequestsList();
      return allRequests;
    } else return AppError.notAllowed("User doesn't have permission to view!");
  }
  updateEmp() {}
  deleteEmp() {}
  provideFeedback() {}
}

export default User;
