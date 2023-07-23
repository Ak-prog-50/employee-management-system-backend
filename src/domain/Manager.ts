import User from "./User";

class Manager extends User {
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
    );
  }
  generateTargetReports() {}
  approveLeaves() {}
  approveTimeSheets() {}
  provideAppraisals() {}
}

export default Manager;
