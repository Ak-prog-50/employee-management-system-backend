import Employee from "../domain/Employee";
import HRPerson from "../domain/HRPerson";
import Manager from "../domain/Manager";
import User from "../domain/User";
import { TGetUser, TSaveUser } from "../interactors/user.interactor";
import logger from "../logger";

const saveUser: TSaveUser = async function (user) {
  // do a db query save user object.
  return user;
};

const getUser: TGetUser = async (empId) => {
  // do a db query get user object.
  let user: User = new Employee();
  switch (user.role) {
    case "employee":
      return new Employee();
    case "manager":
      return new Manager();
    case "hrPerson":
      return new HRPerson();
    // default:
    //   logger.error("Invalid user role");
    //   break;
  }
};

export { getUser, saveUser };
