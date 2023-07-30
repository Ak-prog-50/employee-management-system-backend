import { Router } from "express";
import wrapAsyncExpress from "../utils/error-handling/wrapExpressAsync";
import ScheduleController from "../controllers/schedule.controller";

export default function scheduleRouter() {
  const router = Router();
  const scheduleController = new ScheduleController();

  router.post(
    "/",
    wrapAsyncExpress(
      scheduleController.createSchedule.bind(scheduleController),
    ),
  );

  router.put(
    "/:schedule_id",
    wrapAsyncExpress(
      scheduleController.updateSchedule.bind(scheduleController),
    ),
  );

  router.get(
    "/:schedule_id",
    wrapAsyncExpress(
      scheduleController.getScheduleById.bind(scheduleController),
    ),
  );

  router.get(
    "/employee/:emp_id",
    wrapAsyncExpress(
      scheduleController.getSchedulesByEmpId.bind(scheduleController),
    ),
  );

  router.post(
    "/approve/:schedule_id",
    wrapAsyncExpress(
      scheduleController.approveSchedule.bind(scheduleController),
    ),
  );

  router.post(
    "/reject/:schedule_id",
    wrapAsyncExpress(
      scheduleController.rejectSchedule.bind(scheduleController),
    ),
  );

  router.get(
    "/availability-check/:emp_id/:date_to_check",
    wrapAsyncExpress(
      scheduleController.checkEmployeeAvailability.bind(scheduleController),
    ),
  );

  return router;
}
