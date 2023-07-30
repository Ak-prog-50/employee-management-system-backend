// interactors/target.interactor.ts
import ScheduleDB from "../data-access/models/schedule.db";
import TargetModel from "../data-access/models/target.model";
import TargetDB from "../data-access/target.db";
import TimesheetList from "../data-access/timesheet.db";
import AppError from "../utils/error-handling/AppErrror";

class TargetInteractor {
  private targetDB: TargetDB;
  private scheduleDB: ScheduleDB;
  private timeSheetDB: TimesheetList;

  constructor(
    targetDB: TargetDB,
    scheduleDB: ScheduleDB,
    timeSheetDB: TimesheetList,
  ) {
    this.targetDB = targetDB;
    this.scheduleDB = scheduleDB;
    this.timeSheetDB = timeSheetDB;
  }

  async createTarget(
    empId: number,
    date: Date,
  ): Promise<TargetModel | AppError> {
    const allSchedules =
      await this.scheduleDB.getApprovedSchedulesByEmpIdOfDate(empId, date);
    const allTimesheets =
      await this.timeSheetDB.getApprovedTimesheetsByEmpIdOfDate(empId, date);

    if (allSchedules.length === 0 || allTimesheets.length === 0) {
      return AppError.internal(
        empId.toString(),
        "Approved Schedules or TimeSheets are empty!",
        "",
        {
          schedulesLength: allSchedules.length,
          timesheetsLength: allTimesheets.length,
        },
      );
    }
    // Step 1: Map through schedules and get the sum of scheduledAmounts
    const scheduledAmountSum = allSchedules.reduce(
      (sum, schedule) => sum + (schedule?.scheduledCollection ?? 0),
      0,
    );

    // Step 2: Map through timesheets and get the sum of collectedAmounts
    const collectedAmountSum = allTimesheets.reduce(
      (sum, timesheet) => sum + (timesheet?.collectedAmount ?? 0),
      0,
    );

    // Step 3: Calculate the target percentage for the day
    // const targetPercentage =
    //   collectedAmountSum >= scheduledAmountSum ? 100
    //     : (collectedAmountSum / scheduledAmountSum) * 100;
    const targetPercentage = (collectedAmountSum / scheduledAmountSum) * 100;

    // 4. then create new TargetModel and assign it to variable target.
    const target = {
      empId: empId,
      collectedAmount: collectedAmountSum,
      scheduledAmount: scheduledAmountSum,
      targetCoveragePercentage: targetPercentage,
    };

    try {
      const createdTarget = await this.targetDB.createTarget(
        new TargetModel({ ...target }),
      );
      return createdTarget;
    } catch (error) {
      console.error("Error creating target in interactor", error);
      throw new Error("Failed to create target");
    }
  }

  async getTargetReportByEmpId(empId: number): Promise<TargetModel[] | null> {
    try {
      const targets = await this.targetDB.getTargetReportByEmpId(empId);
      return targets;
    } catch (error) {
      console.error("Error fetching target report in interactor", error);
      throw new Error("Failed to fetch target report");
    }
  }
}

export default TargetInteractor;
