import Employee from "../domain/Employee";
import HRPerson from "../domain/HRPerson";
import Manager from "../domain/Manager";
import User from "../domain/User";
import {
  TGetUserById,
  TGetUserModelById,
  TSaveUser,
} from "../interactors/user.interactor";
import logger from "../logger";
import { TRole } from "../types/generalTypes";
import UserModel from "./models/user.model";

const saveUser: TSaveUser = async function (user: User, password: string) {
  // do a db query save user object.
  const userInstance = new UserModel({ ...user, protectedPassword: password });
  return await userInstance.save();
};

async function updateUserDB(
  empId: number,
  updateFields: Partial<User>,
): Promise<UserModel | null> {
  try {
    const user = await UserModel.findByPk(empId);

    if (!user) {
      logger.error("User not found");
      return null;
    }

    // Update the fields in the user instance
    Object.assign(user, updateFields);

    // Save the changes to the database
    await user.save();

    return user;
  } catch (error) {
    logger.error("Error updating user:", error);
    return null;
  }
}

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
        ...user.dataValues,
        age: user.age,
      });
    case "manager":
      return new Manager({ ...user.dataValues, age: user.age });
    case "hrPerson":
      return new HRPerson({ ...user.dataValues, age: user.age });
    default:
      logger.error("Invalid user role");
      return null;
  }
};

const getUserModelById: TGetUserModelById = async (empId) => {
  return await UserModel.findByPk(empId);
};

async function findUserByEmail(email: string): Promise<UserModel | null> {
  return await UserModel.findOne({ where: { email: email } });
}

async function getAllUsersByRole(role: TRole): Promise<UserModel[]> {
  try {
    return await UserModel.findAll({ where: { role: role } });
  } catch (error) {
    logger.error("Error fetching users by role:", error);
    return [];
  }
}

export {
  getUserById,
  saveUser,
  findUserByEmail,
  getUserModelById,
  updateUserDB,
  getAllUsersByRole
};
