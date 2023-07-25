import LeaveModel from "../data-access/models/leave.model";
import { ILeaveParams, Leave, LeaveStatus } from "../domain/Leave";
import User from "../domain/User";
import AppError from "../utils/error-handling/AppErrror";

export type TCreateLeaveDB = (leave: Leave) => Promise<LeaveModel | AppError>;
export type TGetLeaveByIdDB = (leaveId: number) => Promise<LeaveModel | null>;
export type TUpdateLeaveDB = (
  leave: Leave,
  leaveIdToUpdate: number,
) => Promise<void>;

export async function requestLeave(
  loggedInUser: User,
  leaveObj: ILeaveParams,
  createLeaveDB: TCreateLeaveDB,
): Promise<LeaveModel | AppError> {
  try {
    const empId = loggedInUser.empId;
    if (!empId) {
      return AppError.internal(loggedInUser.email, "Emp Id is null!");
    }
    leaveObj.empId = empId;
    const requestedLeave = await Leave.requestLeave(
      empId,
      loggedInUser.appDate,
      leaveObj,
      createLeaveDB,
    );
    return requestedLeave;
  } catch (error) {
    return AppError.internal(
      leaveObj.empId.toString(),
      "Error requesting leave",
    );
  }
}

export async function approveLeave(
  leaveId: number,
  getLeaveById: TGetLeaveByIdDB,
  updateLeave: TUpdateLeaveDB,
): Promise<void | AppError> {
  try {
    // Find the leave by leaveId in the database
    const leave = await getLeaveById(leaveId);
    if (!leave) {
      return AppError.notFound("Leave not found");
    }

    // Perform necessary validations and logic for approving the leave
    leave.approveLeave();
    await updateLeave(leave, leaveId);
  } catch (error) {
    return AppError.internal("", "Error approving leave");
  }
}

export async function rejectLeave(
  leaveId: number,
  getLeaveById: TGetLeaveByIdDB,
  updateLeave: TUpdateLeaveDB,
): Promise<void | AppError> {
  try {
    // Find the leave by leaveId in the database
    const leave = await getLeaveById(leaveId);
    if (!leave) {
      return AppError.notFound("Leave not found");
    }

    // Perform necessary validations and logic for rejecting the leave
    leave.rejectLeave();
    await updateLeave(leave, leaveId);
  } catch (error) {
    return AppError.internal("", "Error rejecting leave");
  }
}
