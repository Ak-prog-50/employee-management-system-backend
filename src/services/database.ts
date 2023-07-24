import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import errHandlerAsync from "../utils/error-handling/errHandlerAsync";
import UserModel from "../data-access/models/user.model";
import { saveUser } from "../data-access/user.db";
import HRPerson from "../domain/HRPerson";
import { SEED_HR_PERSON_ID } from "../config";
import { protectPwd } from "../utils/pwdHelpers";
import RegistrationRequestModel from "../data-access/models/registrationRequest.model";

dotenv.config();

async function dbConnect() {
  const sequelize = new Sequelize(
    "micro_credit_development",
    "root",
    process.env.DB_PASSWORD,
    {
      host: "localhost",
      dialect: "mysql",
    },
  );
  const [, err] = await errHandlerAsync(sequelize.authenticate());

  if (err) console.error("Unable to connect to the database:", err);
  else {
    console.log("Database connection established!");
    sequelize.addModels([UserModel, RegistrationRequestModel]);
    await sequelize.sync({ force: true, match: /_development$/ });
  }
}

async function seedDB() {
  const seedHRPerson = new HRPerson({
    empId: null, // empId will be auto-incremented
    name: "Jane Smith",
    contactNo: "9876543210",
    email: "jane.smith@example.com",
    age: 35,
    designation: "HR Manager",
    address: "456 Park Avenue, Townsville",
    dob: new Date("1993-07-24"),
    appDate: new Date("2020-10-05"),
  });
  const protectedPwd = await protectPwd("password");
  await saveUser(seedHRPerson, protectedPwd).catch((err) =>
    console.error("error at seeding db", err),
  );
}

async function dbDisconnect() {}

export { dbConnect, seedDB };
