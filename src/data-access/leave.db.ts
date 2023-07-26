import { Leave, LeaveType } from "../domain/Leave";
import { TUpdateLeaveDB } from "../interactors/leave.interactor";
import AppError from "../utils/error-handling/AppErrror";
import LeaveModel from "./models/leave.model";
import UserModel from "./models/user.model";

async function saveLeave(leave: Leave): Promise<LeaveModel | AppError> {
  try {
    // const savedLeave = await LeaveModel.create({
    //   empId: leave.empId,
    //   leaveType: leave.leaveType,
    // });
    const leaveInstance = new LeaveModel({
      ...leave,
    });
    return await leaveInstance.save();
  } catch (error) {
    return AppError.internal(
      leave.empId.toString(),
      "Error saving leave object!",
    );
  }
}

async function getLeaveById(leaveId: number): Promise<LeaveModel | null> {
  try {
    const leave = await LeaveModel.findByPk(leaveId);
    if (!leave) {
      return null;
    }

    return new LeaveModel({ ...leave });
  } catch (error) {
    // todo: return <LeaveModel | AppError>
    throw new Error("Error retrieving leave!");
  }
}

const updateLeave: TUpdateLeaveDB = async function (
  leave: Leave,
  leaveIdToUpdate: number,
): Promise<void | AppError> {
  try {
    await LeaveModel.update(
      {
        leaveType: leave.leaveType,
        leaveStatus: leave.status,
      },
      {
        where: {
          leaveId: leaveIdToUpdate,
        },
      },
    );
  } catch (error) {
    return AppError.internal(
      leave.empId.toString(),
      "Error updating leave object!",
    );
  }
};

/**
 * checks if leaves available in the relavant type.
 * if so reduce leave balance and increment taken leaves.
 */
async function updateLeaveBalance(
  empId: number,
  leaveType: LeaveType,
): Promise<AppError | null> {
  try {
    const user = await UserModel.findOne({ where: { empId } });
    if (!user) {
      throw new Error("User not found");
    }

    // Reduce the balance of the relevant leave type and increment takenLeaves by one
    switch (leaveType) {
      case LeaveType.Casual:
        if (user.casualLeavesBalance > 0) {
          await user.decrement(`${leaveType}LeavesBalance`);
          await user.increment("takenLeaves");
        } else {
          throw new Error("Insufficient casual leave balance");
        }
        break;
      case LeaveType.Sick:
        if (user.sickLeavesBalance > 0) {
          await user.decrement(`${leaveType}LeavesBalance`);
          await user.increment("takenLeaves");
        } else {
          throw new Error("Insufficient sick leave balance");
        }
        break;
      case LeaveType.Annual:
        if (user.annualLeavesBalance > 0) {
          await user.decrement(`${leaveType}LeavesBalance`);
          await user.increment("takenLeaves");
        } else {
          throw new Error("Insufficient annual leave balance");
        }
        break;
      case LeaveType.Duty:
        if (user.dutyLeavesBalance > 0) {
          await user.decrement(`${leaveType}LeavesBalance`);
          await user.increment("takenLeaves");
        } else {
          throw new Error("Insufficient duty leave balance");
        }
        break;
      default:
        throw new Error("Invalid leave type");
    }

    // Save the updated user model to the database and reload the instance
    // await user.save();
    // console.log("saved", user.dataValues);
    // await user.reload();

    return null;
  } catch (error: any) {
    return AppError.internal(
      empId.toString(),
      `Error reducing leave balance: ${error?.message}`,
    );
  }
}

export { saveLeave, getLeaveById, updateLeave, updateLeaveBalance };
