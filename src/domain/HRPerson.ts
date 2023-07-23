import { TRole } from "../types/generalTypes";
import User from "./User";

class HRPerson extends User {
  constructor(
    empId: number,
    name: string,
    contactNo: number,
    email: string,
    age: number,
    designation: string,
    address: string,
    dob: Date,
    appDate: Date,
    role: TRole = "hrPerson",
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
  generatePerformanceReport() {}
  createSchedules() {}
}

export default HRPerson;
