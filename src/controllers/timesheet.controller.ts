// controllers/timesheetController.ts
import { Request, Response } from "express";
import TimesheetInteractor from "../interactors/timesheet.interactor";
import TimesheetModel, {
  TimesheetStatus,
} from "../data-access/models/timesheet.model";
import TimesheetList from "../data-access/timesheet.db";
import User from "../domain/User";
import appErrorHandler from "../utils/error-handling/appErrorHandler";
import AppResponse from "../utils/AppResponse";
import { INext } from "../types/vendor/INext";
import AppError from "../utils/error-handling/AppErrror";

// todo: no AppResponse, AppError, TExpressAsyncCallback

class TimesheetController {
  private timesheetInteractor: TimesheetInteractor = new TimesheetInteractor(
    new TimesheetList(),
  );

  // constructor(timesheetInteractor: TimesheetInteractor) {
  //   this.timesheetInteractor = timesheetInteractor;
  // }
  
  async viewAllTimeSheets(req: Request, res: Response, next: INext) {
    const ret = await this.timesheetInteractor.viewAllTimeSheets(req.user ? (req.user as User) : undefined);
    if (ret instanceof AppError) {
      appErrorHandler(ret, req, res, next);
      return;
    } else return AppResponse.success(res, ret.msg, ret.data);
  }

  async createTimesheet(req: Request, res: Response) {
    let timesheet: TimesheetModel = req.body;
    if (req.user) {
      const empId = (req.user as User).empId;
      timesheet.emp_id = empId ? empId : timesheet.emp_id;
    } else {
      res.status(401).json({ message: "Not logged in" });
      return;
    }

    try {
      const createdTimesheet = await this.timesheetInteractor.createTimesheet(
        timesheet,
      );
      res.status(201).json(createdTimesheet);
      return;
    } catch (error) {
      console.error("Error creating timesheet", error);
      res.status(500).json({ message: "Failed to create timesheet" });
      return;
    }
  }

  async updateTimesheet(req: Request, res: Response) {
    let timesheet: TimesheetModel = req.body;
    const timesheet_id = Number(req.params.timesheet_id);
    timesheet.timesheet_id = timesheet_id;
    if (req.user) {
      const empId = (req.user as User).empId;
      timesheet.emp_id = empId ? empId : timesheet.emp_id;
    } else {
      res.status(401).json({ message: "Not logged in" });
      return;
    }
    try {
      const updatedTimesheet = await this.timesheetInteractor.updateTimesheet(
        timesheet,
      );
      res.status(200).json(updatedTimesheet);
    } catch (error) {
      console.error("Error updating timesheet", error);
      res.status(500).json({ message: "Failed to update timesheet" });
    }
  }

  async getTimesheetById(req: Request, res: Response) {
    if (!req.user) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }
    // todo: pass user to interactor and check if user is prviledged
    const timesheet_id = Number(req.params.timesheet_id);
    try {
      const timesheet = await this.timesheetInteractor.getTimesheetById(
        timesheet_id,
      );
      if (!timesheet) {
        res.status(404).json({ message: "Timesheet not found" });
      } else {
        res.status(200).json(timesheet);
      }
    } catch (error) {
      console.error("Error fetching timesheet", error);
      res.status(500).json({ message: "Failed to fetch timesheet" });
    }
  }

  async getTimesheetsByEmpId(req: Request, res: Response) {
    // todo: pass user to interactor and check if user is prviledged
    if (!req.user) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }
    const emp_id = Number(req.params.emp_id);
    try {
      const timesheets = await this.timesheetInteractor.getTimesheetsByEmpId(
        emp_id,
      );
      res.status(200).json(timesheets);
    } catch (error) {
      console.error("Error fetching timesheets", error);
      res.status(500).json({ message: "Failed to fetch timesheets" });
    }
  }

  async approveTimesheet(req: Request, res: Response) {
    // todo: move logic to interactor
    if (!req.user || (req.user && (req.user as User).role !== "manager")) {
      res.status(401).json({ message: "User not logged In or no prviledged user!" });
      return;
    }

    const timesheet_id = Number(req.params.timesheet_id);
    try {
      const timesheet = await this.timesheetInteractor.getTimesheetById(
        timesheet_id,
      );
      if (!timesheet) {
        res.status(404).json({ message: "Timesheet not found" });
      } else {
        timesheet.status = TimesheetStatus.Approved;
        const updatedTimesheet = await this.timesheetInteractor.updateTimesheet(
          timesheet.dataValues,
        );
        res.status(200).json(updatedTimesheet);
      }
    } catch (error) {
      console.error("Error approving timesheet", error);
      res.status(500).json({ message: "Failed to approve timesheet" });
    }
  }

  async rejectTimesheet(req: Request, res: Response) {
    // todo: move logic to interactor
    if (!req.user || (req.user && (req.user as User).role !== "manager")) {
      res.status(401).json({ message: "User not logged In or no prviledged user!" });
      return;
    }

    const timesheet_id = Number(req.params.timesheet_id);
    try {
      const timesheet = await this.timesheetInteractor.getTimesheetById(
        timesheet_id,
      );
      if (!timesheet) {
        res.status(404).json({ message: "Timesheet not found" });
      } else {
        timesheet.status = TimesheetStatus.Rejected;
        const updatedTimesheet = await this.timesheetInteractor.updateTimesheet(
          timesheet.dataValues,
        );
        res.status(200).json(updatedTimesheet);
      }
    } catch (error) {
      console.error("Error rejecting timesheet", error);
      res.status(500).json({ message: "Failed to reject timesheet" });
    }
  }
}

export default TimesheetController;
