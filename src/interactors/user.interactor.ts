import UserModel from "../data-access/models/userModel";
import User from "../domain/User";
import { IinteractorReturn } from "../types/generalTypes";
import AppError from "../utils/error-handling/AppErrror";

export type TSaveUser = (user: User, password: string) => Promise<UserModel>;
export type TGetUserById = (empId: number) => Promise<User | null>;

interface ICreateUserDB {
  saveUser: TSaveUser;
  getUser: TGetUserById;
}

async function createUser(
  empIdOfCaller: number | null,
  userDetails: User,
  createUserDB: ICreateUserDB,
): Promise<IinteractorReturn<UserModel>> {
  if (empIdOfCaller) {
    const user = await createUserDB.getUser(empIdOfCaller);
    if (user === null) {
      return {
        appError: AppError.notFound("User not found"),
        sucessData: null,
      };
    }
    const ret = await user.registerEmp(userDetails, createUserDB.saveUser);
    return {
      appError: ret instanceof AppError ? ret : null,
      sucessData: ret instanceof AppError ? null : ret,
    };
  } else {
    // send a request and save it in db
    return {
      appError: AppError.internal("", "Not Implemented"),
      sucessData: null,
    };
  }
}

export { createUser };
