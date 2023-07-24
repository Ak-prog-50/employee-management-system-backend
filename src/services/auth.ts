import passport, { AuthenticateCallback } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { TExpressCallback } from "../types/expressTypes";
import appErrorHandler from "../utils/error-handling/appErrorHandler";
import { findUserByEmail, getUserById } from "../data-access/user.db";
import AppResponse from "../utils/AppResponse";
import AppError from "../utils/error-handling/AppErrror";
import { comparePwd } from "../utils/pwdHelpers";

// Configure the local strategy for Passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Use 'email' as the username field
    },
    async (email, password, done) => {
      try {
        // Find the user by email in your data access layer
        const user = await findUserByEmail(email);

        if (user === null) {
          return done(null, false, { message: "Incorrect email!" });
        }

        // Check if the provided password matches the hashed password in the database
        const isPasswordValid = await comparePwd(
          password,
          user.protectedPassword,
        );
        // const isPasswordValid = password === user.protectedPassword;

        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect password!" });
        }

        // If authentication is successful, return the user object
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Serialize and store the user object to the session
passport.serializeUser((user: any, done) => {
  done(null, user.empId); // Change 'id' to the actual property representing the user's unique identifier
});
// Retrieve and Deserialize the user object from the session
passport.deserializeUser(async (id: number, done) => {
  try {
    // Find the user by id in your data access layer
    const user = await getUserById(id);

    if (!user) {
      return done(new Error("User not found"));
    }

    // If the user is found, return the user object
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

// Helper function for passport authentication
// todo: maybe move res.send code to controller for better readabilty?
export const authenticateUser: TExpressCallback = (req, res, next) => {
  const authCallBack: AuthenticateCallback = (err, user, info) => {
    if (err) {
      const errObj = err?.message ? AppError.internal("", err.message) : err;
      appErrorHandler(errObj, req, res, next);
      return;
    }

    if (!user) {
      // Authentication failed, redirect or return an error response
      appErrorHandler(
        AppError.internal("", JSON.stringify(info)),
        req,
        res,
        next,
      );
      return;
    }

    // Authentication successful, store the authenticated user in the request object
    req.login(user, (loginErr) => {
      if (loginErr) {
        appErrorHandler(loginErr, req, res, next);
        return;
      }
      AppResponse.success(res, "Logged In!", user);
      return;
      // // Proceed to the next middleware or route handler
      // return next();
    });
  };
  passport.authenticate("local", authCallBack)(req, res, next);
};
