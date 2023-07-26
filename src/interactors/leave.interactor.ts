import LeaveModel from "../data-access/models/leave.model";
import { ILeaveParams, Leave, LeaveStatus } from "../domain/Leave";
import Manager from "../domain/Manager";
import User from "../domain/User";
import AppError from "../utils/error-handling/AppErrror";

export type TCreateLeaveDB = (leave: Leave) => Promise<LeaveModel | AppError>;
export type TGetLeaveByIdDB = (leaveId: number) => Promise<LeaveModel | null>;
export type TUpdateLeaveDB = (
  leave: Leave,
  leaveIdToUpdate: number,
) => Promise<void | AppError>;

// prettier-ignore
export async function viewAllLeaves(loggedInUser: User | undefined): Promise<AppError | {
  msg: string;
  data: LeaveModel[];
}> {
  // todo: add pagination
  try {
    if (loggedInUser instanceof User) {
      // todo: move this part to domain layer and extract findAll to a data layer function.
      const canViewAll = loggedInUser instanceof Manager;
      const leaves = canViewAll
        ? await LeaveModel.findAll()
        : await LeaveModel.findAll({
            where: {
              empId: loggedInUser.empId,
            },
          });
      return {
        msg: canViewAll
          ? "All Employees' leaves are fetched!"
          : "Your Leaves are fetched.",
        data: leaves,
      };
    } else return AppError.notAllowed("", "User has to be logged In!");
  } catch (error) {
    return AppError.internal("", "Error viewing all leaves");
  }
}

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
  loggedInUser: User | undefined,
  leaveId: number,
  getLeaveById: TGetLeaveByIdDB,
  updateLeave: TUpdateLeaveDB,
): Promise<void | AppError> {
  try {
    if (loggedInUser instanceof User) {
      // Find the leave by leaveId in the database
      const leaveInstanceDB = await getLeaveById(leaveId);
      if (!leaveInstanceDB) {
        return AppError.notFound("Leave not found");
      }

      const leave = new Leave({ ...leaveInstanceDB.dataValues });
      if (!loggedInUser.role)
        // this has to be always present since loggedInUser returned from findUserByID at auth
        return AppError.internal(
          loggedInUser.email,
          "Logged In user Role not found!",
        );
      const ret = await leave.approveLeave(
        loggedInUser.role,
        leaveId,
        updateLeave,
      );
      return ret;
    } else return AppError.notAllowed("", "User has to be logged In!");
  } catch (error) {
    return AppError.internal("", "Error approving leave");
  }
}

export async function rejectLeave(
  loggedInUser: User | undefined,
  leaveId: number,
  getLeaveById: TGetLeaveByIdDB,
  updateLeave: TUpdateLeaveDB,
): Promise<void | AppError> {
  try {
    if (loggedInUser instanceof User) {
      // Find the leave by leaveId in the database
      const leaveInstanceDB = await getLeaveById(leaveId);
      if (!leaveInstanceDB) {
        return AppError.notFound("Leave not found");
      }

      const leave = new Leave({ ...leaveInstanceDB.dataValues });
      if (!loggedInUser.role)
        // this has to be always present since loggedInUser returned from findUserByID at auth
        return AppError.internal(
          loggedInUser.email,
          "Logged In user Role not found!",
        );
      const ret = await leave.rejectLeave(
        loggedInUser.role,
        leaveId,
        updateLeave,
      );
      return ret;
    } else return AppError.notAllowed("", "User has to be logged In!");
  } catch (error) {
    return AppError.internal("", "Error rejecting leave");
  }
}
