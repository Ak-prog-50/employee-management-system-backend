import User from "../domain/User";
import { IinteractorReturn } from "../types/generalTypes";
import AppError from "../utils/error-handling/AppErrror";

export type TSaveUser = (user: User) => Promise<User>;
export type TGetUser = (empId: number) => Promise<User>;

interface ICreateUserDB {
  saveUser: TSaveUser;
  getUser: TGetUser;
}

export interface IPersonalDetails {
  name: string;
  contactNo: number;
  email: string;
  age: number;
  designation: string;
  address: string;
  dob: Date;
}

async function createUser(
  empId: number | null,
  personalDetails: IPersonalDetails,
  createUserDB: ICreateUserDB,
): Promise<IinteractorReturn<User>> {
  if (empId) {
    const user: User = await createUserDB.getUser(empId);
    return await user.registerEmp(personalDetails, createUserDB.saveUser);
  } else {
    // send a request and save it in db
  }

  return {
    appError: null,
    sucessData: null,
  };
}

export { createUser };
