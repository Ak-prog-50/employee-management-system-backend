// controllers/schedule.controller.ts
import { Request, Response } from "express";
import ScheduleInteractor from "../interactors/schedule.interactor";
import ScheduleModel from "../data-access/models/schedule.model";
import User from "../domain/User";

class ScheduleController {
  private scheduleInteractor: ScheduleInteractor;

  constructor(scheduleInteractor: ScheduleInteractor) {
    this.scheduleInteractor = scheduleInteractor;
  }

  async createSchedule(req: Request, res: Response) {
    // todo: move logic to interactor
    if (!req.user || (req.user && (req.user as User).role !== "hrPerson")) {
      res
        .status(401)
        .json({ message: "User not logged In or no prviledged user!" });
      return;
    }
    const schedule: ScheduleModel = req.body;
    // todo: check req.body props

    // Check employee availability before updating schedule
    const isEmployeeAvailable =
      await this.scheduleInteractor.checkEmployeeAvailability(schedule.empId, schedule.scheduledDate);

    if (!isEmployeeAvailable) {
      res.status(400).json({ message: "Employee is not available" });
      return;
    }

    try {
      const createdSchedule = await this.scheduleInteractor.createSchedule(
        schedule,
      );
      res.status(201).json(createdSchedule);
      return;
    } catch (error) {
      console.error("Error creating schedule", error);
      res.status(500).json({ message: "Failed to create schedule" });
      return;
    }
  }

  async updateSchedule(req: Request, res: Response) {
    // todo: move logic to interactor
    if (
      !req.user ||
      (req.user && (req.user as User).role !== "hrPerson") ||
      (req.user && (req.user as User).role !== "manager")
    ) {
      res
        .status(401)
        .json({ message: "User not logged In or no prviledged user!" });
      return;
    }

    const schedule: ScheduleModel = req.body;
    // todo: check req.body props

    // Check employee availability before updating schedule
    const isEmployeeAvailable =
      await this.scheduleInteractor.checkEmployeeAvailability(schedule.empId, schedule.scheduledDate);

    if (!isEmployeeAvailable) {
      res.status(400).json({ message: "Employee is not available" });
      return;
    }

    try {
      const updatedSchedule = await this.scheduleInteractor.updateSchedule(
        schedule,
      );
      if (!updatedSchedule) {
        res.status(404).json({ message: "Schedule not found" });
      } else {
        res.status(200).json(updatedSchedule);
      }
    } catch (error) {
      console.error("Error updating schedule", error);
      res.status(500).json({ message: "Failed to update schedule" });
    }
  }

  async getScheduleById(req: Request, res: Response) {
    if (!req.user) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }

    // todo: pass user to interactor and check if user is privileged
    const scheduleId = Number(req.params.scheduleId);
    try {
      const schedule = await this.scheduleInteractor.getScheduleById(
        scheduleId,
      );
      if (!schedule) {
        res.status(404).json({ message: "Schedule not found" });
      } else {
        res.status(200).json(schedule);
      }
    } catch (error) {
      console.error("Error fetching schedule", error);
      res.status(500).json({ message: "Failed to fetch schedule" });
    }
  }

  async getSchedulesByEmpId(req: Request, res: Response) {
    // todo: pass user to interactor and check if user is privileged
    if (!req.user) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }
    const empId = Number(req.params.emp_id);
    try {
      const schedules = await this.scheduleInteractor.getSchedulesByEmpId(
        empId,
      );
      res.status(200).json(schedules);
    } catch (error) {
      console.error("Error fetching schedules", error);
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  }
}

export default ScheduleController;