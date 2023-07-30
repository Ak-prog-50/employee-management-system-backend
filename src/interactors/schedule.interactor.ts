// interactors/schedule.interactor.ts
import LeaveModel from "../data-access/models/leave.model";
import ScheduleDB from "../data-access/models/schedule.db";
import ScheduleModel from "../data-access/models/schedule.model";
import { LeaveStatus } from "../domain/Leave";

// todo: create domain layer for if there's core business logic
// todo: implement notification sending

class ScheduleInteractor {
  private scheduleDB: ScheduleDB;
  private getLeavesByEmpId: any;

  constructor(scheduleDB: ScheduleDB, getLeavesByEmpId: any) {
    this.scheduleDB = scheduleDB;
    this.getLeavesByEmpId = getLeavesByEmpId;
  }

  async createSchedule(schedule: ScheduleModel): Promise<ScheduleModel> {
    // todo: check if loggedInUser's role eql to HrPerson
    return await this.scheduleDB.createSchedule(schedule);
  }

  async updateSchedule(schedule: ScheduleModel): Promise<ScheduleModel | null> {
    // todo: check if loggedInUser's role eql to HrPerson or Manager
    return await this.scheduleDB.updateSchedule(schedule);
  }

  async getScheduleById(scheduleId: number): Promise<ScheduleModel | null> {
    // todo: check if loggedInUser's role eql to HrPerson or Manager
    return await this.scheduleDB.getScheduleById(scheduleId);
  }

  async getSchedulesByEmpId(empId: number): Promise<ScheduleModel[]> {
    // todo: empId should be from loggedInUser
    return await this.scheduleDB.getSchedulesByEmpId(empId);
  }

  async checkEmployeeAvailability(
    empId: number,
    dateToCheck: Date,
  ): Promise<boolean> {
    const leaves: LeaveModel[] = await this.getLeavesByEmpId(empId);
    for (const leave of leaves) {
      if (
        leave.status !== LeaveStatus.Rejected &&
        dateToCheck >= leave.startDate &&
        dateToCheck <= leave.endDate
      ) {
        return false;
      }
    }
    return true;
  }
}

export default ScheduleInteractor;
