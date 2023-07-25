import { Router } from "express";
import wrapAsyncExpress from "../utils/error-handling/wrapExpressAsync";
import { viewRegistrationReqController } from "../controllers/registrationReq.controller";

export default function registraionRequestRouter() {
  const router = Router();
  router.get("/", wrapAsyncExpress(viewRegistrationReqController));

  return router;
}
