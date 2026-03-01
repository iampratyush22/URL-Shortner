import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserValidator } from "./user.validator";
import { UserReop } from "./user.repo";

export const userRouter = Router();

const controller = new UserController(new UserService(new UserValidator(),new UserReop()));

userRouter.post('/login', controller.login.bind(controller));
userRouter.post('/register', controller.register.bind(controller));
