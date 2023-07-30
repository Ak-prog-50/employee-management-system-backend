import TimesheetModel from "../data-access/models/timesheet.model";
import TimesheetList from "../data-access/timesheet.db";

// todo: create domain layer for if there's core business logic
// todo: implement notification sending

class TimesheetInteractor {
  private timesheetList: TimesheetList;

  constructor(timeSheetList: TimesheetList) {
    this.timesheetList = timeSheetList;
  }

  async createTimesheet(timesheet: TimesheetModel): Promise<TimesheetModel> {
    // Add any validation or business logic here
    return this.timesheetList.createTimesheet(timesheet);
  }

  async updateTimesheet(timesheet: TimesheetModel): Promise<TimesheetModel> {
    // Add any validation or business logic here
    return this.timesheetList.updateTimesheet(timesheet);
  }

  async getTimesheetById(timesheet_id: number): Promise<TimesheetModel | null> {
    return this.timesheetList.getTimesheetById(timesheet_id);
  }

  async getTimesheetsByEmpId(emp_id: number): Promise<TimesheetModel[]> {
    return this.timesheetList.getTimesheetsByEmpId(emp_id);
  }
}

export default TimesheetInteractor;
