import { updateLeaveBalance } from "../data-access/leave.db";
import LeaveModel from "../data-access/models/leave.model";
import {
  getAllUsersByRole,
  getUserModelById,
} from "../data-access/user.db";
import {
  TCreateLeaveDB,
  TUpdateLeaveDB,
} from "../interactors/leave.interactor";
import { sendEmail } from "../services/emailService";
import { TRole } from "../types/generalTypes";
import AppError from "../utils/error-handling/AppErrror";
import getDateDiff from "../utils/getDateDiff";

export interface ILeaveParams {
  leaveId: number | null; // will be incremented automatically in db
  empId: number;
  startDate: Date;
  endDate: Date;
  status: LeaveStatus;
  leaveType: LeaveType;
}

export enum LeaveType {
  Casual = "casual",
  Sick = "sick",
  Annual = "annual",
  Duty = "duty",
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
  leaveType: LeaveType;
  constructor(params: ILeaveParams) {
    this.leaveId = params.leaveId;
    this.empId = params.empId;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.status = params.status;
    this.leaveType = params.leaveType;
  }
  private static isAppDateValid(appDate: Date): boolean {
    // Calculate the difference between appDate and the current date
    const currentDate = new Date();
    const threeMonthsAgo = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 3,
      currentDate.getDate(),
    );

    // Check if appDate is at least 3 months before the current date
    return appDate <= threeMonthsAgo;
  }

  //todo: data layer functions and service calls to interactor layer?
  static async requestLeave(
    userId: number,
    userAppDate: Date,
    leaveObj: ILeaveParams,
    saveLeaveRequest: TCreateLeaveDB,
  ): Promise<LeaveModel | AppError> {
    if (!this.isAppDateValid(userAppDate)) {
      return AppError.notAllowed(
        "Cannot request leave. Minimum 3 months of service required.",
      );
    }

    const gonnaTakeLeaves = await getDateDiff(
      leaveObj.startDate,
      leaveObj.endDate,
    );
    const user = await getUserModelById(userId);
    if (user === null) return AppError.notFound("User is null");
    const availableLeaves = user.entitLeaves - user.takenLeaves;
    if (gonnaTakeLeaves > availableLeaves) {
      return AppError.notAllowed("Not enough leaves!");
    }

    const leave = new Leave({ ...leaveObj, status: LeaveStatus.Pending });

    const getAllRecipients = await getAllUsersByRole("manager");
    const emailList = getAllRecipients.map((reci) => reci.email);
    const mailOptions = {
      from: user.email, // Replace with your "From" email name and address
      to: emailList.join(", "),
      subject: "Employee is requesting approval for leave", // Email subject
      html: `
        <p>Employee ${this.name} is requesting approval for leave. Please attend to the matter.</p>
        <p>Best regards,</p>
        <p>Micro Credit Investments</p>
      `,
    };
    await sendEmail(mailOptions);
    // Save the leave request to the database or any appropriate data store
    return await saveLeaveRequest(leave);
    // todo: ( save notifications to data store and display in ui. maybe send email of all requested leaves after every 24Hrs? )
  }

  async approveLeave(
    actionPerformerRole: TRole,
    userId: number,
    leaveObj: ILeaveParams,
  ): Promise<void | AppError> {
    if (actionPerformerRole !== "manager")
      return AppError.notAllowed("User not allowed to approve leaves!");
    // actionPerformer manually reviews leave requests on client side
    // todo: actionPerformer can call this more than once. Return a message if already approved at the interactor layer.
    // todo: Manager can request and approve leaves by himself.
    const ret = await updateLeaveBalance(
      leaveObj.empId,
      leaveObj.leaveType,
      getDateDiff(leaveObj.startDate, leaveObj.endDate),
    );
    if (ret instanceof AppError) return ret;
    this.status = LeaveStatus.Approved;
  }

  async rejectLeave(
    actionPerformerRole: TRole,
    leaveIdToApprove: number,
    updateLeaveRequest: TUpdateLeaveDB,
  ): Promise<void | AppError> {
    if (actionPerformerRole !== "manager")
      return AppError.notAllowed("User not allowed to reject leaves!");
    // actionPerformer manually reviews leave requests on client side
    // todo: actionPerformer can call this more than once. Return a message if already approved at the interactor layer.
    // todo: Manager can request and approve leaves by himself.
    this.status = LeaveStatus.Rejected;
    // Save the updated leave status to the database or any appropriate data store
  }

  async editLeave() {}
  async deleteLeave() {}
  async getDaysLeft(): Promise<number> {
    return 0;
  }
}
