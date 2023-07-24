import User, { IUserParams } from "./User";

class Employee extends User {
  constructor(params: IUserParams) {
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
      params.role, // todo: hardcode role
    );
  }
  requestRegistrationApproval() {}
  viewPerformanceReport() {}
  viewTargetReport() {}
}

export default Employee;
