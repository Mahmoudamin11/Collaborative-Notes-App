import express from "express";
import authController from "@controllers/auth.controller";
import { validate } from "@middleware/validate";
import { RegisterSchema, LoginSchema } from "@validators/auth.schema";

const authRouter = express.Router();

authRouter.post("/register", validate({body: RegisterSchema}), authController.register);
authRouter.post("/login", validate({body : LoginSchema}), authController.login);
authRouter.post("/refresh", authController.refresh);

export default authRouter;
