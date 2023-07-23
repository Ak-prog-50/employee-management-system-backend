import { createUser } from "../interactors/user.interactor";
import { TExpressCallback } from "../types/expressTypes";
import AppResponse from "../utils/AppResponse";
import AppError from "../utils/error-handling/AppErrror";
import errHandlerAsync from "../utils/error-handling/errHandlerAsync";
import { IinteractorReturn } from "../types/generalTypes";
import appErrorHandler from "../utils/error-handling/appErrorHandler";
import { getUserById, saveUser } from "../data-access/user.db";
import User from "../domain/User";
import UserModel from "../data-access/models/userModel";

/**
 * Factory function to create an Express middleware that handles the creation of a user.
 * @returns {TExpressCallback} An Express middleware function that will be passed into 'create-user' route.
 */
function makeCreateUserController(): TExpressCallback {
  return async (req, res, next) => {
    let { empIdOfCaller, registrantDetails } = req.body;

    // validating req.body properties
    registrantDetails = {
      ...registrantDetails,
      empId: registrantDetails.empId || null,
      appDate: new Date(),
      role: null,
    };
    if (
      !(registrantDetails instanceof User) ||
      !empIdOfCaller ||
      typeof empIdOfCaller === "string"
    ) {
      AppError.badRequest("Invalid request body");
      return;
    }

    // This object containing related db functions will be injected to interactor.
    const createUserDB = {
      saveUser: saveUser,
      getUser: getUserById,
    };
    const [result, unHandledErr] =
      await errHandlerAsync<IinteractorReturn<UserModel>>( // prettier-ignore
        createUser(null, registrantDetails, createUserDB),
      );
    if (unHandledErr !== null) {
      appErrorHandler(unHandledErr, req, res, next);
      return;
    } else if (result !== null) {
      const { appError, sucessData: createdUser } = result;
      if (appError === null && createdUser !== null) {
        AppResponse.created(res, "User created", createdUser);
        return;
      }
      if (appError instanceof AppError) {
        appErrorHandler(appError, req, res, next);
        return;
      }
    }
  };
}

export { makeCreateUserController };
