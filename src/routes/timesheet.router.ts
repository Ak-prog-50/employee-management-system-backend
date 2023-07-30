import { Router } from "express";
import TimesheetInteractor from "../interactors/timesheet.interactor";
import wrapAsyncExpress from "../utils/error-handling/wrapExpressAsync";
import TimesheetController from "../controllers/timesheet.controller";

export default function timeSheetRouter(
) {
  const router = Router();
  const timesheetController = new TimesheetController();

  router.post(
    "/timesheets",
    wrapAsyncExpress(
      timesheetController.createTimesheet.bind(timesheetController),
    ),
  );

  router.put(
    "/timesheets/:timesheet_id",
    wrapAsyncExpress(
      timesheetController.updateTimesheet.bind(timesheetController),
    ),
  );

  router.get(
    "/timesheets/:timesheet_id",
    wrapAsyncExpress(
      timesheetController.getTimesheetById.bind(timesheetController),
    ),
  );

  router.get(
    "/timesheets/employee/:emp_id",
    wrapAsyncExpress(
      timesheetController.getTimesheetsByEmpId.bind(timesheetController),
    ),
  );

  return router;
}
