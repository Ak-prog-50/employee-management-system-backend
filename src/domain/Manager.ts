import User, { IUserParams } from "./User";

type TManagerParams = Omit<IUserParams, "role">;

class Manager extends User {
  constructor(params: TManagerParams) {
    super(
      params.empId,
      params.name,
      params.contactNo,
      params.email,
      params.age,
      params.designation,
      params.address,
      params.dob,
      params.appDate,
      "manager",
    );
  }
  generateTargetReports() {}
  approveLeaves() {}
  approveTimeSheets() {}
  provideAppraisals() {}
}

export default Manager;
