// routers/timeSheetRouter.ts
import { Router } from "express";
import TargetController from "../controllers/target.controller";
import wrapAsyncExpress from "../utils/error-handling/wrapExpressAsync";

export default function targetReportRouter() {
  const router = Router();
  const targetController = new TargetController();

  router.get(
    "/:empId",
    wrapAsyncExpress(
      targetController.getTargetReportsOfEmpId.bind(targetController),
    ),
  );

  router.post(
    "/",
    wrapAsyncExpress(targetController.createTarget.bind(targetController)),
  );

  return router;
}
