import { Request, Response, NextFunction } from "express";
import {
  requestLeave,
  approveLeave,
  rejectLeave,
} from "../interactors/leave.interactor";
import AppResponse from "../utils/AppResponse";
import { notifyEmployeeLeaveStatus } from "../services/emailService";
import AppError from "../utils/error-handling/AppErrror";
import appErrorHandler from "../utils/error-handling/appErrorHandler";
import { getLeaveById, saveLeave, updateLeave } from "../data-access/leave.db";
import { ILeaveParams } from "../domain/Leave";
import User from "../domain/User";

export const requestLeaveController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { leaveObj } = req.body;
  // todo: type check leaveObj
  if (req.user) {
    const result = await requestLeave(
      req.user as User,
      leaveObj as ILeaveParams,
      saveLeave,
    );

    if (result instanceof AppError) {
      appErrorHandler(result, req, res, next);
      return;
    }

    AppResponse.success(res, "Leave request submitted", result);
    return;
  }
  // todo: pass req.user | null or to interactor and handle not logged in error at interactor.
  else
    return appErrorHandler(
      AppError.notAllowed("User not logged in!"),
      req,
      res,
      next,
    );
};

export const approveLeaveController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const leaveId: number = req.body.leaveId;
  // todo: validate leaveId in req.body
  const result = await approveLeave(
    req.user ? (req.user as User) : undefined,
    leaveId,
    getLeaveById,
    updateLeave,
  );

  if (result instanceof AppError) {
    appErrorHandler(result, req, res, next);
    return;
  }

  AppResponse.success(res, "Leave request approved");
  return;
};

export const rejectLeaveController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const leaveId: number = req.body.leaveId;
  // todo: validate leaveId in req.body
  const result = await rejectLeave(
    req.user ? (req.user as User) : undefined,
    leaveId,
    getLeaveById,
    updateLeave,
  );

  if (result instanceof AppError) {
    appErrorHandler(result, req, res, next);
    return;
  }

  AppResponse.success(res, "Leave request rejected");
};
