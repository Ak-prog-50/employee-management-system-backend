import RegistrationRequestModel from "../data-access/models/registrationRequest.model";
import User from "../domain/User";
import { IinteractorReturn } from "../types/generalTypes";
import AppError from "../utils/error-handling/AppErrror";

export type TfetchRegistrationRequestsList = () => Promise<
  RegistrationRequestModel[] | AppError
>;

async function viewAllRegistrationRequests(
  loggedInUser: User,
  fetchRegistrationRequestsList: TfetchRegistrationRequestsList,
): Promise<IinteractorReturn<RegistrationRequestModel[]>> {
  const ret = await loggedInUser.viewRegistrationRequests(
    fetchRegistrationRequestsList,
  );
  return {
    appError: ret instanceof AppError ? ret : null,
    sucessData: ret instanceof AppError ? null : ret,
  };
}

export { viewAllRegistrationRequests };
