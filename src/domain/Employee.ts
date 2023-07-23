import { TRole } from "../types/generalTypes";
import User from "./User";

class Employee extends User {
  constructor(
    empId: number | null,
    name: string,
    contactNo: number,
    email: string,
    age: number,
    designation: string,
    address: string,
    dob: Date,
    appDate: Date,
    role: TRole,
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
  requestRegistrationApproval() {}
  viewPerformanceReport() {}
  viewTargetReport() {}
}

export default Employee;
