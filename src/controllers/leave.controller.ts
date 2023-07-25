// leave.controller.ts (Controller Layer)

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

export const requestLeaveController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { leaveObj } = req.body;
  // todo: type check leaveObj
  const result = await requestLeave(leaveObj, saveLeave);

  if (result instanceof AppError) {
    appErrorHandler(result, req, res, next);
    return;
  }

  AppResponse.success(res, "Leave request submitted", result);
  return;
};

export const approveLeaveController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const leaveId = parseInt(req.params.leaveId, 10);
  const result = await approveLeave(leaveId, getLeaveById, updateLeave);

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
  const leaveId = parseInt(req.params.leaveId, 10);
  const result = await rejectLeave(leaveId, getLeaveById, updateLeave);

  if (result instanceof AppError) {
    appErrorHandler(result, req, res, next);
    return;
  }

  AppResponse.success(res, "Leave request rejected");
};
