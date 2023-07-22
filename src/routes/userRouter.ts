import { Router } from "express";
import { makeCreateUserController } from "../controllers/userController";

export default function userRouter() {
  const router = Router();
  router.post("/create-user", makeCreateUserController());

  return router;
}
