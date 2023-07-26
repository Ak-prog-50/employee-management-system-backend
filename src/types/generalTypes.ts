import AppError from "../utils/error-handling/AppErrror";

type TRequestProperty = string | undefined;
type TRole = "employee" | "manager" | "hrPerson";

// todo: maybe this not needed in user.interactor
interface IinteractorReturn<T = unknown> {
  appError: AppError | null;
  sucessData: T | null;
}

function isIinteractorReturn(value: any): value is IinteractorReturn {
  return (
    typeof value === "object" &&
    (value.appError === null || value.appError instanceof AppError) &&
    (value.successData === null || typeof value.successData !== "undefined")
  );
}

export { TRequestProperty, IinteractorReturn, isIinteractorReturn, TRole };
