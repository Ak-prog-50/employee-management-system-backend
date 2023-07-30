import { saveRegistrationRequest } from "../data-access/registrationReq.db"; //todo: inject this
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
  //todo: data layer functions and service calls to interactor layer?
  async requestRegistrationApproval() {
    // todo: add logic to prevent duplicate registration
    return await saveRegistrationRequest(this);
    // todo: notify HRPerson or/and Manager. ( save notifications to data store and display in ui. maybe send email of all registration reqs after every 24Hrs? )
    // send a push notification to ui as well
  }
  viewPerformanceReport() {}
  viewTargetReport() {}
}

export default Employee;
