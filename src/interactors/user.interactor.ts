import RegistrationRequestModel from "../data-access/models/registrationRequest.model";
import UserModel from "../data-access/models/user.model";
import Employee from "../domain/Employee";
import User from "../domain/User";
import { IinteractorReturn } from "../types/generalTypes";
import AppError from "../utils/error-handling/AppErrror";

export type TSaveUser = (user: User, password: string) => Promise<UserModel>;
export type TGetUserById = (empId: number) => Promise<User | null>;

interface ICreateUserDB {
  saveUser: TSaveUser;
  // getUser: TGetUserById;
}

/**
 * used to create new user or request user creation
 */
// todo: rename function to registerUser or approveRegistrant
async function createUser(
  loggedInUser: User | null,
  registrant: User,
  createUserDB: ICreateUserDB,
): Promise<IinteractorReturn<UserModel | RegistrationRequestModel>> {
  // loggednInUser has to be priviledged since it returned from getUserById at deserialzieUser function in auth.
  if (loggedInUser) {
    const ret = await loggedInUser.registerEmp(
      registrant,
      createUserDB.saveUser,
    );
    return {
      appError: ret instanceof AppError ? ret : null,
      sucessData: ret instanceof AppError ? null : ret,
    };
  } else {
    // todo: move this else block to new interactor 'requestRegistration'
    const employee = new Employee(registrant);
    const registrationRequest = await employee.requestRegistrationApproval();
    return {
      appError: null,
      sucessData: registrationRequest,
    };
  }
}

export { createUser };
