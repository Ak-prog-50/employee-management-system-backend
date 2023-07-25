import { createUser } from "../interactors/user.interactor";
import { TExpressAsyncCallback } from "../types/expressTypes";
import AppResponse from "../utils/AppResponse";
import AppError from "../utils/error-handling/AppErrror";
import errHandlerAsync from "../utils/error-handling/errHandlerAsync";
import { IinteractorReturn } from "../types/generalTypes";
import appErrorHandler from "../utils/error-handling/appErrorHandler";
import { getUserById, saveUser } from "../data-access/user.db";
import User from "../domain/User";
import UserModel from "../data-access/models/user.model";
import Employee from "../domain/Employee";
import { authenticateUser } from "../services/auth";
import RegistrationRequestModel from "../data-access/models/registrationRequest.model";
import { isUserParams } from "../utils/typecheckers";

/**
 * @type {TExpressAsyncCallback} An Express middleware function that will be passed into 'create-user' route.
 */
// todo: seperate createUserController to request registration and registration approval.
const createUserController: TExpressAsyncCallback = async function (
  req,
  res,
  next,
) {
  /**
   * registrantDetails is not valid => invalid registrant details
   * empIdOfCaller = null, registrantDetails is validObject=> request for registration by anyone
   * empIfOfCaller = empId, registrantDetails is validObject => create user by loggedIn priviledged user or revert if loggedInUser is not priviledged.
   */
  let { empIdOfCaller, registrantDetails } = req.body;

  // validating req.body properties
  if (typeof empIdOfCaller !== "number" && empIdOfCaller !== null) {
    appErrorHandler(
      AppError.badRequest("Invalid employee id of caller!"),
      req,
      res,
      next,
    );
    return;
  }
  registrantDetails = {
    ...registrantDetails,
    empId: registrantDetails?.empId || null,
    role: null,
  };

  if (!isUserParams(registrantDetails)) {
    appErrorHandler(
      AppError.badRequest("Invalid registrant details!"),
      req,
      res,
      next,
    );
    return;
  }

  // This object containing related db functions will be injected to interactor.
  const createUserDB = {
    saveUser: saveUser,
    // getUser: getUserById,
  };
  if (empIdOfCaller && !req.user) {
    appErrorHandler(
      AppError.notAllowed("Priviledged Employee has to be logged in!"),
      req,
      res,
      next,
    );
    return;
  }
  const registrant = new Employee(registrantDetails);
  const [result, unHandledErr] =
    await errHandlerAsync<IinteractorReturn<UserModel | RegistrationRequestModel>>( // prettier-ignore
      createUser(
        req.user ? (req.user as User) : null,
        registrant,
        createUserDB,
      ),
    );
  if (unHandledErr !== null) {
    appErrorHandler(unHandledErr, req, res, next);
    return;
  } else if (result !== null) {
    const { appError, sucessData: savedUser } = result;
    if (appError === null && savedUser !== null) {
      AppResponse.created(
        res,
        "User created or registration request sent",
        savedUser,
      );
      return;
    }
    if (appError instanceof AppError) {
      appErrorHandler(appError, req, res, next);
      return;
    }
  }
};

/**
 * email and password should be present in req.body.
 * it will be extracted by passport.js. Upon login user
 * object will be sent to client.
 */
const loginUserController: TExpressAsyncCallback = async function (
  req,
  res,
  next,
) {
  // If the authentication is successful, the user object will be available in req.user
  authenticateUser(req, res, next);
};

export { createUserController, loginUserController };
