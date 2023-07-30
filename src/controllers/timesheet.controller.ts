// controllers/timesheetController.ts
import { Request, Response } from "express";
import TimesheetInteractor from "../interactors/timesheet.interactor";
import TimesheetModel from "../data-access/models/timesheet.model";
import TimesheetList from "../data-access/timesheet.db";

// todo: no AppResponse, AppError, TExpressAsyncCallback

class TimesheetController {
  private timesheetInteractor: TimesheetInteractor = new TimesheetInteractor(
    new TimesheetList(),
  );

  // constructor(timesheetInteractor: TimesheetInteractor) {
  //   this.timesheetInteractor = timesheetInteractor;
  // }

  async createTimesheet(req: Request, res: Response) {
    const timesheet: TimesheetModel = req.body;
    try {
      const createdTimesheet = await this.timesheetInteractor.createTimesheet(
        timesheet,
      );
      res.status(201).json(createdTimesheet);
    } catch (error) {
      console.error("Error creating timesheet", error);
      res.status(500).json({ error: "Failed to create timesheet" });
    }
  }

  async updateTimesheet(req: Request, res: Response) {
    const timesheet: TimesheetModel = req.body;
    try {
      const updatedTimesheet = await this.timesheetInteractor.updateTimesheet(
        timesheet,
      );
      res.status(200).json(updatedTimesheet);
    } catch (error) {
      console.error("Error updating timesheet", error);
      res.status(500).json({ error: "Failed to update timesheet" });
    }
  }

  async getTimesheetById(req: Request, res: Response) {
    const timesheet_id = Number(req.params.timesheet_id);
    try {
      const timesheet = await this.timesheetInteractor.getTimesheetById(
        timesheet_id,
      );
      if (!timesheet) {
        res.status(404).json({ error: "Timesheet not found" });
      } else {
        res.status(200).json(timesheet);
      }
    } catch (error) {
      console.error("Error fetching timesheet", error);
      res.status(500).json({ error: "Failed to fetch timesheet" });
    }
  }

  async getTimesheetsByEmpId(req: Request, res: Response) {
    const emp_id = Number(req.params.emp_id);
    try {
      const timesheets = await this.timesheetInteractor.getTimesheetsByEmpId(
        emp_id,
      );
      res.status(200).json(timesheets);
    } catch (error) {
      console.error("Error fetching timesheets", error);
      res.status(500).json({ error: "Failed to fetch timesheets" });
    }
  }
}

export default TimesheetController;
