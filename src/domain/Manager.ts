import { TRole } from "../types/generalTypes";
import User from "./User";

class Manager extends User {
  constructor(
    empId: number,
    name: string,
    contactNo: string,
    email: string,
    age: number,
    designation: string,
    address: string,
    dob: Date,
    appDate: Date,
    role: TRole = "manager",
  ) {
    super(
      empId,
      name,
      contactNo,
      email,
      age,
      designation,
      address,
      dob,
      appDate,
      role,
    );
  }
  generateTargetReports() {}
  approveLeaves() {}
  approveTimeSheets() {}
  provideAppraisals() {}
}

export default Manager;
