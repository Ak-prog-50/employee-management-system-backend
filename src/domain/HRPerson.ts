import User, { IUserParams } from "./User";

type THRPersonParams = Omit<IUserParams, "role">;

class HRPerson extends User {
  constructor(params: THRPersonParams) {
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
      "hrPerson",
    );
  }
  generatePerformanceReport() {}
  createSchedules() {}
}

export default HRPerson;
