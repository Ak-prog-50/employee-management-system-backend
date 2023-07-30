import { Router } from "express";
import wrapAsyncExpress from "../utils/error-handling/wrapExpressAsync";
import TimesheetController from "../controllers/timesheet.controller";

export default function timeSheetRouter() {
  const router = Router();
  const timesheetController = new TimesheetController();

  router.get(
    "/",
    wrapAsyncExpress(
      timesheetController.viewAllTimeSheets.bind(timesheetController),
    ),
  );

  router.post(
    "/",
    wrapAsyncExpress(
      timesheetController.createTimesheet.bind(timesheetController),
    ),
  );

  router.put(
    "/:timesheet_id",
    wrapAsyncExpress(
      timesheetController.updateTimesheet.bind(timesheetController),
    ),
  );

  router.get(
    "/:timesheet_id",
    wrapAsyncExpress(
      timesheetController.getTimesheetById.bind(timesheetController),
    ),
  );

  router.get(
    "/employee/:emp_id",
    wrapAsyncExpress(
      timesheetController.getTimesheetsByEmpId.bind(timesheetController),
    ),
  );

  router.post(
    "/approve/:timesheet_id",
    wrapAsyncExpress(
      timesheetController.approveTimesheet.bind(timesheetController),
    ),
  );

  router.post(
    "/reject/:timesheet_id",
    wrapAsyncExpress(
      timesheetController.rejectTimesheet.bind(timesheetController),
    ),
  );

  return router;
}
