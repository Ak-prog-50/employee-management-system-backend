import { TUpdateUser, createUser, getUser, updateUser } from "../interactors/user.interactor";
import { TExpressAsyncCallback } from "../types/expressTypes";
import AppResponse from "../utils/AppResponse";
import AppError from "../utils/error-handling/AppErrror";
import errHandlerAsync from "../utils/error-handling/errHandlerAsync";
import { IinteractorReturn } from "../types/generalTypes";
import appErrorHandler from "../utils/error-handling/appErrorHandler";
import {
  getUserById,
  getUserModelById,
  saveUser,
  updateUserDB
} from "../data-access/user.db";
import User from "../domain/User";
import UserModel from "../data-access/models/user.model";
import Employee from "../domain/Employee";
import { authenticateUser } from "../services/auth";
import RegistrationRequestModel from "../data-access/models/registrationRequest.model";
import { isUserParams } from "../utils/typecheckers";
import { IResponse } from "../types/vendor/IResponse";
import { INext } from "../types/vendor/INext";
import logger from "../logger";
import { IRequest } from "../types/vendor/IRequest";

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
    age: 0, // age doesn't matter. will be derived.
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
  // todo: remove errHandlerAsync. all unhandled errors will get caught at wrapAsyncExpress.
  const [result, unHandledErr] =
    await errHandlerAsync<IinteractorReturn<UserModel | RegistrationRequestModel>>( // prettier-ignore
      createUser(
        empIdOfCaller ? (req.user as User) : null,
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
    } else if (appError instanceof AppError) {
      appErrorHandler(appError, req, res, next);
      return;
    }
  }
};

const getUserController: TExpressAsyncCallback = async function (
  req,
  res,
  next,
) {
  const { empId } = req.params;
  // console.log("🚀 ~ file: user.controller.ts:115 ~ empId:", empId)
  if (typeof Number(empId) !== "number") {
    appErrorHandler(
      AppError.badRequest("Invalid employee id!"),
      req,
      res,
      next,
    );
    return;
  }
  const ret = await getUser(Number(empId), getUserModelById);
  if (ret instanceof AppError) {
    appErrorHandler(ret, req, res, next);
    return;
  } else {
    AppResponse.success(res, "User found", ret);
    return;
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

const logoutUserController = async (
  req: any,
  res: IResponse,
  next: INext,
): Promise<void> => {
  if (!req.logout) {
    appErrorHandler(
      AppError.internal("", "req.logout is not defined!"),
      req,
      res,
      next,
    );
    return;
  }
  req.logout(function (err: any) {
    if (err) {
      logger.error("error at logout: ", err);
      appErrorHandler(
        AppError.internal("", "Unhandled error at logout!"),
        req,
        res,
        next,
      );
      return;
    }
    AppResponse.success(res, "Logged out successfully");
    return;
  });
};

const updateUserController: TExpressAsyncCallback = async function (
  req: IRequest,
  res: IResponse,
  next: INext,
) {
  const updateFields = req.body;
  const { empId } = updateFields;

  // Check if the empId is a valid number
  if (typeof Number(empId) !== "number") {
    appErrorHandler(
      AppError.badRequest("Invalid employee id!"),
      req,
      res,
      next,
    );
    return;
  }

  // Check if updateFields is a valid object
  if (typeof updateFields !== "object" || updateFields === null) {
    appErrorHandler(
      AppError.badRequest("Invalid update fields!"),
      req,
      res,
      next,
    );
    return;
  }

  const [result, unhandledErr] = await errHandlerAsync<IinteractorReturn<any>>(
    updateUser(Number(empId), updateFields, updateUserDB),
  );

  if (unhandledErr !== null) {
    appErrorHandler(unhandledErr, req, res, next);
    return;
  } else if (result !== null) {
    const { appError, sucessData } = result;
    if (appError === null && sucessData !== null) {
      AppResponse.success(res, "User updated successfully", sucessData);
      return;
    } else if (appError instanceof AppError) {
      appErrorHandler(appError, req, res, next);
      return;
    }
  }
};

export {
  createUserController,
  getUserController,
  loginUserController,
  logoutUserController,
  updateUserController
};
