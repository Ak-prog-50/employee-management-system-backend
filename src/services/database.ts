import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import errHandlerAsync from "../utils/error-handling/errHandlerAsync";
import UserModel from "../data-access/models/user.model";
import { saveUser } from "../data-access/user.db";
import HRPerson from "../domain/HRPerson";
import { SEED_HR_PERSON_ID } from "../config";
import { protectPwd } from "../utils/pwdHelpers";
import RegistrationRequestModel from "../data-access/models/registrationRequest.model";
import LeaveModel from "../data-access/models/leave.model";
import Manager from "../domain/Manager";

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
    sequelize.addModels([UserModel, RegistrationRequestModel, LeaveModel]);
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
  const seedManager = new Manager({
    empId: null, // empId will be auto-incremented
    name: "John Wick",
    contactNo: "1234567890",
    email: "john.wick@example.com",
    age: 40,
    designation: "Project Manager",
    address: "789 High Street, Cityville",
    dob: new Date("1982-05-15"),
    appDate: new Date("2018-03-20"),
  });
  const seedEmployee = new HRPerson({
    empId: null, // empId will be auto-incremented
    name: "Alice Johnson",
    contactNo: "8765432109",
    email: "alice.johnson@example.com",
    age: 28,
    designation: "Assistant",
    address: "123 Elm Street, Villageland",
    dob: new Date("1995-12-10"),
    appDate: new Date("2022-01-15"),
  });
  const protectedPwd = await protectPwd("password");
  const promises = [
    saveUser(seedHRPerson, protectedPwd),
    saveUser(seedManager, protectedPwd),
    saveUser(seedEmployee, protectedPwd),
  ];
  Promise.all(promises)
    .then(() => {
      console.log("Seeding completed!");
    })
    .catch((errors) => {
      console.error("Errors at seeding db:");
      for (const error of errors) {
        console.error(error);
      }
    });
}

async function dbDisconnect() {}

export { dbConnect, seedDB };
