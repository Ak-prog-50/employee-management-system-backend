import { Router } from "express";
import {
  createUserController,
  getUserController,
  loginUserController,
  logoutUserController,
} from "../controllers/user.controller";
import wrapAsyncExpress from "../utils/error-handling/wrapExpressAsync";

export default function userRouter() {
  const router = Router();
  // todo: currently both requestRegistration process and registration happens at /create-user. seperate them.
  router.get("/get-user/:empId", wrapAsyncExpress(getUserController));
  router.post("/create-user", wrapAsyncExpress(createUserController));
  router.post("/login", wrapAsyncExpress(loginUserController));
  router.post("/logout", wrapAsyncExpress(logoutUserController));

  return router;
}
