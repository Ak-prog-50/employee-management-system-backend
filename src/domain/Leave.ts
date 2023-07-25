import LeaveModel from "../data-access/models/leave.model";
import { TCreateLeaveDB } from "../interactors/leave.interactor";

export interface ILeaveParams {
  leaveId: number | null; // will be incremented automatically in db
  empId: number;
  startDate: Date;
  endDate: Date;
  status: LeaveStatus;
  leaveType: string;
}

export enum LeaveStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export class Leave {
  leaveId: number | null;
  empId: number;
  startDate: Date;
  endDate: Date;
  status: LeaveStatus;
  leaveType: string;
  constructor(params: ILeaveParams) {
    this.leaveId = params.leaveId;
    this.empId = params.empId;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.status = params.status;
    this.leaveType = params.leaveType;
  }

  static async requestLeave(
    leaveObj: ILeaveParams,
    saveLeaveRequest: TCreateLeaveDB,
  ): Promise<LeaveModel> {
    // Check if the employee is eligible to apply for leave based on their service duration and leave credits
    // Perform necessary validations

    // If eligible, create a new Leave object with status 'Pending'
    const leave = new Leave({ ...leaveObj, status: LeaveStatus.Pending });
    // Save the leave request to the database or any appropriate data store
    return await saveLeaveRequest(leave);
  }

  async deleteLeave() {}

  async approveLeave(): Promise<void> {
    // Perform necessary validations and logic for approving the leave
    this.status = LeaveStatus.Approved;
    // Save the updated leave status to the database or any appropriate data store
  }

  async rejectLeave(): Promise<void> {
    // Perform necessary validations and logic for rejecting the leave
    this.status = LeaveStatus.Rejected;
    // Save the updated leave status to the database or any appropriate data store
  }

  async editLeave() {}

  async getDaysLeft(): Promise<number> {
    return 0;
  }
}
