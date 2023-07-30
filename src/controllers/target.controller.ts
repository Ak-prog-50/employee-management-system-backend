// controllers/target.controller.ts
import { Request, Response } from "express";
import TargetInteractor from "../interactors/target.interactor";
import TargetModel from "../data-access/models/target.model";
import TargetDB from "../data-access/target.db";
import ScheduleDB from "../data-access/models/schedule.db";
import TimesheetList from "../data-access/timesheet.db";
import User from "../domain/User";
import AppError from "../utils/error-handling/AppErrror";
import appErrorHandler from "../utils/error-handling/appErrorHandler";
import { INext } from "../types/vendor/INext";

class TargetController {
  private targetInteractor: TargetInteractor = new TargetInteractor(
    new TargetDB(),
    new ScheduleDB(),
    new TimesheetList(),
  );

  //   constructor(targetInteractor: TargetInteractor) {
  //     this.targetInteractor = targetInteractor;
  //   }

  async createTarget(req: Request, res: Response, next: INext) {
    const empId: number = req.body.empId;
    const date: Date = new Date(req.body.date);
    // todo: move to interactor
    if (!req.user || (req.user && (req.user as User).role !== "manager")) {
      res
        .status(401)
        .json({ message: "User not logged In or no prviledged user!" });
      return;
    }

    try {
      const createTargetRet = await this.targetInteractor.createTarget(
        empId,
        date,
      );
      if (createTargetRet instanceof AppError) {
        appErrorHandler(createTargetRet, req, res, next);
        return;
      } else res.status(201).json(createTargetRet);
    } catch (error) {
      console.error("Error creating target at contoller", error);
      res.status(500).json({ error: "Failed to create target" });
    }
  }

  async getTargetReportsOfEmpId(req: Request, res: Response) {
    // todo: check if empId matches the empId of req.user if req.user role is 'employee'
    const empId = Number(req.params.empId);

    try {
      const targetReports = await this.targetInteractor.getTargetReportByEmpId(
        empId,
      );

      if (!targetReports) {
        res.status(404).json({ message: "Target reports not found" });
      } else {
        res.status(200).json(targetReports);
      }
    } catch (error) {
      console.error("Error fetching target reports", error);
      res.status(500).json({ message: "Failed to fetch target reports" });
    }
  }
}

export default TargetController;
