import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import errHandlerAsync from "../utils/error-handling/errHandlerAsync";
dotenv.config();

let sequelize: Sequelize;
async function dbConnect() {
  sequelize = new Sequelize("micro_credit", "root", process.env.DB_PASSWORD, {
    host: "localhost",
    dialect: "mysql",
  });
  const [, err] = await errHandlerAsync(sequelize.authenticate());

  if (err) console.error("Unable to connect to the database:", err);
  else console.log("Database connection established!");
}

async function dbDisconnect() {}

export { dbConnect, sequelize };
