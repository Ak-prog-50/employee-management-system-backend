import { Router } from "express";
import wrapAsyncExpress from "../utils/error-handling/wrapExpressAsync";
import {
  approveLeaveController,
  rejectLeaveController,
  requestLeaveController,
} from "../controllers/leave.controller";

export default function leaveRouter() {
  const router = Router();
  router.post("/request-leave", wrapAsyncExpress(requestLeaveController));
  router.post("/approve-leave", wrapAsyncExpress(approveLeaveController));
  router.post("/reject-leave", wrapAsyncExpress(rejectLeaveController));

  return router;
}
