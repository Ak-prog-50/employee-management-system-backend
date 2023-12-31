import RegistrationRequestModel from "../data-access/models/registrationRequest.model";
import UserModel from "../data-access/models/user.model";
import Employee from "../domain/Employee";
import User from "../domain/User";
import logger from "../logger";
import { IinteractorReturn } from "../types/generalTypes";
import AppError from "../utils/error-handling/AppErrror";

export type TSaveUser = (user: User, password: string) => Promise<UserModel>;
export type TGetUserById = (empId: number) => Promise<User | null>;
export type TGetUserModelById = (empId: number) => Promise<UserModel | null>;
export type TUpdateUser = (
  empId: number,
  updateFields: Partial<User>,
  updateUserDB: (
    empId: number,
    updateFields: Partial<User>,
  ) => Promise<UserModel | null>,
) => Promise<IinteractorReturn<UserModel | null>>;

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

async function getUser(
  empId: number,
  getUserModelById: TGetUserModelById,
): Promise<UserModel | AppError> {
  try {
    const user = await getUserModelById(empId);
    if (user === null) {
      return AppError.notFound("User with given id not found");
    } else return user;
  } catch (error) {
    logger.debug("error at get user", error);
    return AppError.internal(empId.toString(), "Something went wrong!");
  }
}

async function updateUser(
  empId: number,
  updateFields: Partial<User>,
  updateUserDB: (
    empId: number,
    updateFields: Partial<User>,
  ) => Promise<UserModel | null>, // Add this type to the required dependencies
): Promise<IinteractorReturn<UserModel | null>> {
  try {
    // Perform the update using the updateUser function from the data layer
    const updatedUser = await updateUserDB(empId, updateFields);

    if (updatedUser === null) {
      return {
        sucessData: null,
        appError: AppError.notFound("User update failed!"),
      };
    }

    return {
      appError: null,
      sucessData: updatedUser,
    };
  } catch (error) {
    logger.debug("Error updating user:", error);
    return {
      sucessData: null,
      appError: AppError.internal(empId.toString(), "Something went wrong!"),
    };
  }
}

export { createUser, getUser, updateUser };
