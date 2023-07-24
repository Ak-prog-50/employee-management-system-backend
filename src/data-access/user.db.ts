import Employee from "../domain/Employee";
import HRPerson from "../domain/HRPerson";
import Manager from "../domain/Manager";
import User from "../domain/User";
import { TGetUserById, TSaveUser } from "../interactors/user.interactor";
import logger from "../logger";
import UserModel from "./models/userModel";

const saveUser: TSaveUser = async function (user: User) {
  // do a db query save user object.
  const userModel = new UserModel({ ...user });
  return await userModel.save();
};

const getUserById: TGetUserById = async (empId) => {
  // do a db query get user object.
  let user = await UserModel.findByPk(empId);
  if (user == null) {
    logger.error("User not found");
    return null;
  }
  switch (user.role) {
    case "employee":
      return new Employee({
        ...user,
      });
    // case "manager":
    //   return new Manager({...user});
    case "hrPerson":
      return new HRPerson({ ...user });
    default:
      logger.error("Invalid user role");
      return null;
  }
};

export { getUserById, saveUser };
