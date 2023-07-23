import { IPersonalDetails, TSaveUser } from "../interactors/user.interactor";
import { TRole } from "../types/generalTypes";
import AppError from "../utils/error-handling/AppErrror";
import Employee from "./Employee";

abstract class User {
  protected canRegister: boolean = false;

  constructor(
    public empId: number | null,
    public name: string,
    public contactNo: number,
    public email: string,
    public age: number,
    public designation: string,
    public address: string,
    public dob: Date,
    public appDate: Date,
    public role: TRole | null,
  ) {}
  async registerEmp(
    personalDetails: IPersonalDetails,
    saveUser: TSaveUser,
  ): Promise<any> {
    if (this.canRegister) {
      const employee = new Employee(
        null,
        personalDetails.name,
        personalDetails.contactNo,
        personalDetails.email,
        personalDetails.age,
        personalDetails.designation,
        personalDetails.address,
        personalDetails.dob,
        new Date(),
        "employee",
      );
      return await saveUser(employee);
    } else {
      return AppError.notAllowed("User doesn't have permission to register!");
    }
  }
  updateEmp() {}
  deleteEmp() {}
  provideFeedback() {}
}

export default User;
