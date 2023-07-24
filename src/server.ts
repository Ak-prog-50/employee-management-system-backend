import express, { NextFunction } from "express";
import cors from "cors";
import { GET_FRONTEND_URL, NODE_ENVS } from "./config";
import { IRequest } from "./types/vendor/IRequest";
import { IResponse } from "./types/vendor/IResponse";
import userRouter from "./routes/userRouter";
import AppError from "./utils/error-handling/AppErrror";
import appErrorHandler from "./utils/error-handling/appErrorHandler";
import { dbConnect, seedDB } from "./services/database";
import dotenv from "dotenv";
import passport from "passport";
import "./services/auth";
import session from "express-session";
import { authenticateUser } from "./services/auth";

const { PORT } = process.env;
const app = express();
dotenv.config();

// Initial setup for server
app.use(
  cors({
    credentials: true,
    origin: [GET_FRONTEND_URL()],
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Content-Type",
      "Origin",
    ],
  }),
);
app.use(express.json());
// Enable session management
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  }),
);

// Initialize Passport and set up session persistence
app.use(passport.initialize());
app.use(passport.session());

// Map routes
app.get("/", (req: IRequest, res: IResponse) => {
  return res.status(200).json({ message: "Server is Running" });
});

app.use("/user", userRouter());

app.post("/login", (req, res, next) => {
  // If the authentication is successful, the user object will be available in req.user
  // You can redirect the user to the home page or any other authenticated route here
  authenticateUser(req, res, next);
});

app.all("*", (req: IRequest, res: IResponse, next: NextFunction): void => {
  appErrorHandler(AppError.notFound("Route not found"), req, res, next);
});

// Start database connection and server
if (require.main === module) {
  (async function () {
    await dbConnect();
    if (process.env.NODE_ENV === NODE_ENVS.dev) await seedDB();
    app.listen(PORT, () => {
      console.info(`Server is running on port ${PORT}`);
    });
  })();
}
