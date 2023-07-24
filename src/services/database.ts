import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import errHandlerAsync from "../utils/error-handling/errHandlerAsync";
import UserModel from "../data-access/models/userModel";
import { saveUser } from "../data-access/user.db";
import HRPerson from "../domain/HRPerson";
import { SEED_HR_PERSON_ID } from "../config";

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
    sequelize.addModels([UserModel]);
    sequelize.sync({ match: /_development$/ });
  }
}

async function seedDB() {
  const seedHRPerson = new HRPerson({
    empId: SEED_HR_PERSON_ID,
    name: "John Doe",
    contactNo: "1234567890",
    email: "john.doe@example.com",
    age: 30,
    designation: "HR Manager",
    address: "123 Main Street, Cityville",
    dob: new Date("1993-07-24"),
    appDate: new Date(),
  });
  await saveUser(seedHRPerson).catch((err) =>
    console.error("error at seeding db", err),
  );
}

async function dbDisconnect() {}

export { dbConnect, seedDB };
