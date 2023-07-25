import Employee from "../domain/Employee";
import HRPerson from "../domain/HRPerson";
import Manager from "../domain/Manager";
import User from "../domain/User";
import { TGetUserById, TSaveUser } from "../interactors/user.interactor";
import logger from "../logger";
import UserModel from "./models/user.model";

const saveUser: TSaveUser = async function (user: User, password: string) {
  // do a db query save user object.
  const userInstance = new UserModel({ ...user, protectedPassword: password });
  return await userInstance.save();
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
        age: user.age,
      });
    // case "manager":
    //   return new Manager({...user});
    case "hrPerson":
      return new HRPerson({ ...user, age: user.age });
    default:
      logger.error("Invalid user role");
      return null;
  }
};

async function findUserByEmail(email: string): Promise<UserModel | null> {
  return await UserModel.findOne({ where: { email: email } });
}

export { getUserById, saveUser, findUserByEmail };
