import { saveRegistrationRequest } from "../data-access/registrationReq.db"; //todo: inject this
import { getAllUsersByRole } from "../data-access/user.db";
import { sendEmail } from "../services/emailService";
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
    const getAllHrs = await getAllUsersByRole("hrPerson");
    const emailList = getAllHrs.map((hr) => hr.email);
    const mailOptions = {
      from: this.email, // Replace with your "From" email name and address
      to: emailList.join(", "),
      subject: "Employee is requesting approval for registration", // Email subject
      html: `
        <p>Employee ${this.name} is requesting approval for registration. Please attend to the matter.</p>
        <p>Best regards,</p>
        <p>Micro Credit Investments</p>
      `,
    };
    await sendEmail(mailOptions);

    return await saveRegistrationRequest(this);
    // todo: ( save notifications to data store and display in ui. maybe send email of all registration reqs after every 24Hrs? )
  }
  viewPerformanceReport() {}
  viewTargetReport() {}
}

export default Employee;
