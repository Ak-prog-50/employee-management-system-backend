import TimesheetModel from "../data-access/models/timesheet.model";
import TimesheetList from "../data-access/timesheet.db";
import Manager from "../domain/Manager";
import User from "../domain/User";
import AppError from "../utils/error-handling/AppErrror";

// todo: create domain layer for if there's core business logic
// todo: implement notification sending

class TimesheetInteractor {
  private timesheetList: TimesheetList;

  constructor(timeSheetList: TimesheetList) {
    this.timesheetList = timeSheetList;
  }

  async viewAllTimeSheets(loggedInUser: User | undefined) {
    try {
      if (loggedInUser instanceof User) {
        // todo: extract findAll to a data layer function.
        const canViewAll = loggedInUser instanceof Manager;
        if (!loggedInUser.empId) {
          return AppError.internal("", "Emp Id is not set!");
        }
        const timesheets = canViewAll
          ? await TimesheetModel.findAll()
          : await TimesheetModel.findAll({
              where: {
                emp_id: loggedInUser.empId,
              },
            });
        return {
          msg: canViewAll
            ? "All Employees' timesheets are fetched!"
            : "Your timesheets are fetched.",
          data: timesheets,
        };
      } else return AppError.notAllowed("User has to be logged In!");
    } catch (error) {
      return AppError.internal("", "Error viewing all timesheets");
    }
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
