import { fetchAllRegistrationRequests } from "../data-access/registrationReq.db";
import User from "../domain/User";
import { viewAllRegistrationRequests } from "../interactors/registrationReq.interactor";
import { TExpressAsyncCallback } from "../types/expressTypes";
import AppResponse from "../utils/AppResponse";
import AppError from "../utils/error-handling/AppErrror";
import appErrorHandler from "../utils/error-handling/appErrorHandler";

const viewRegistrationReqController: TExpressAsyncCallback = async (
  req,
  res,
  next,
) => {
  if (req.user) {
    const loggedInUser = req.user as User; // req.user is returned from getUserById at auth
    const ret = await viewAllRegistrationRequests(
      loggedInUser,
      fetchAllRegistrationRequests,
    );
    const { appError, sucessData: allRequests } = ret;
    if (appError instanceof AppError) {
      appErrorHandler(appError, req, res, next);
      return;
    } else if (appError === null && allRequests !== null) {
      AppResponse.success(
        res,
        "All registration requests fetched successfully!",
        allRequests,
      );
      return;
    }
  } else {
    appErrorHandler(AppError.notAllowed("Not logged In!"), req, res, next);
    return;
  }
};

export { viewRegistrationReqController };
