import TimesheetModel from "./models/timesheet.model";

class TimesheetList {
  async createTimesheet(
    timesheetData: TimesheetModel,
  ): Promise<TimesheetModel> {
    const timesheet = await TimesheetModel.create(timesheetData);
    return timesheet;
  }

  async updateTimesheet(
    timesheetData: TimesheetModel,
  ): Promise<TimesheetModel> {
    const timesheet = await TimesheetModel.findOne({
      where: { timesheet_id: timesheetData.timesheet_id },
    });

    if (!timesheet) {
      throw new Error("Timesheet not found");
    }

    await timesheet.update(timesheetData);
    return timesheet;
  }

  async getTimesheetById(timesheet_id: number): Promise<TimesheetModel | null> {
    const timesheet = await TimesheetModel.findByPk(timesheet_id);
    return timesheet;
  }

  async getTimesheetsByEmpId(emp_id: number): Promise<TimesheetModel[]> {
    const timesheets = await TimesheetModel.findAll({
      where: { emp_id },
    });
    return timesheets;
  }
}

export default TimesheetList;