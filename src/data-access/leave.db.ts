import { Leave } from "../domain/Leave";
import LeaveModel from "./models/leave.model";

async function saveLeave(leave: Leave): Promise<LeaveModel> {
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
    throw new Error("Error saving leave");
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
    throw new Error("Error retrieving leave");
  }
}

async function updateLeave(
  leave: Leave,
  leaveIdToUpdate: number,
): Promise<void> {
  try {
    await LeaveModel.update(
      {
        empId: leave.empId,
        leaveType: leave.leaveType,
      },
      {
        where: {
          leaveId: leaveIdToUpdate,
        },
      },
    );
  } catch (error) {
    throw new Error("Error updating leave");
  }
}

export { saveLeave, getLeaveById, updateLeave };
