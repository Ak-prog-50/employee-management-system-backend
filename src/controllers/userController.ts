import { createUser as createUserInteractor } from "../interactors/user.interactor";
import { TExpressCallback } from "../types/expressTypes";
import AppResponse from "../utils/AppResponse";
import AppError from "../utils/error-handling/AppErrror";
import errHandlerAsync from "../utils/error-handling/errHandlerAsync";
import { IinteractorReturn } from "../types/generalTypes";
import appErrorHandler from "../utils/error-handling/appErrorHandler";
import { getUser, saveUser } from "../data-access/user.db";
import { validateStrings } from "../utils/validateReqProperties";
import User from "../domain/User";

/**
 * Factory function to create an Express middleware that handles the creation of a user.
 * @returns {TExpressCallback} An Express middleware function that will be passed into 'create-user' route.
 */
function makeCreateUserController(): TExpressCallback {
  return async (req, res, next) => {
    const { empId, personalDetails } = req.body;

    // validating req.body properties

    // This object containing related db functions will be injected to interactor.
    const createUserDB = {
      saveUser: saveUser,
      getUser: getUser,
    };
    const [result, unHandledErr] =
      await errHandlerAsync<IinteractorReturn<User>>( // prettier-ignore
        createUserInteractor(null, personalDetails as any, createUserDB),
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
