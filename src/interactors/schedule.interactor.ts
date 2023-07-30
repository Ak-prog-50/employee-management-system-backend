// interactors/schedule.interactor.ts
import ScheduleDB from "../data-access/models/schedule.db";
import ScheduleModel from "../data-access/models/schedule.model";

// todo: create domain layer for if there's core business logic
// todo: implement notification sending

class ScheduleInteractor {
  private scheduleDB: ScheduleDB;

  constructor(scheduleDB: ScheduleDB) {
    this.scheduleDB = scheduleDB;
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

  async checkEmployeeAvailability(empId: number): Promise<boolean> {
    // Implement the logic to check employee availability by checking leaves
    // You can use the TimesheetDB and LeaveDB to fetch leaves and then check availability
    // You may need to define additional functions in TimesheetDB and LeaveDB to retrieve leaves for an employee
    return true; // Return true for now, assuming employee is available
  }
}

export default ScheduleInteractor;
