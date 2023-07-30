// controllers/target.controller.ts
import { Request, Response } from "express";
import TargetInteractor from "../interactors/target.interactor";
import TargetModel from "../data-access/models/target.model";
import TargetDB from "../data-access/target.db";
import ScheduleDB from "../data-access/models/schedule.db";
import TimesheetList from "../data-access/timesheet.db";

class TargetController {
  private targetInteractor: TargetInteractor = new TargetInteractor(
    new TargetDB(),
    new ScheduleDB(),
    new TimesheetList(),
  );

  //   constructor(targetInteractor: TargetInteractor) {
  //     this.targetInteractor = targetInteractor;
  //   }

  async createTarget(req: Request, res: Response) {
    const empId: number = req.body.empId;
    const date: Date = new Date(req.body.date);
    // todo: req.user

    try {
      const createdTarget = await this.targetInteractor.createTarget(
        empId,
        date,
      );
      res.status(201).json(createdTarget);
    } catch (error) {
      console.error("Error creating target", error);
      res.status(500).json({ error: "Failed to create target" });
    }
  }

  async getTargetReportByEmpId(req: Request, res: Response) {
    const empId = Number(req.params.empId);

    try {
      const targetReport = await this.targetInteractor.getTargetReportByEmpId(
        empId,
      );

      if (!targetReport) {
        res.status(404).json({ message: "Target report not found" });
      } else {
        res.status(200).json(targetReport);
      }
    } catch (error) {
      console.error("Error fetching target report", error);
      res.status(500).json({ message: "Failed to fetch target report" });
    }
  }
}

export default TargetController;
