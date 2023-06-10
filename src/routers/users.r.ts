import { Router } from "express";
import * as userHandlers from "../handlers/users.h";
import * as middleWares from "../middlewares/auth";

const user = Router();

user.get("/", userHandlers.findUsers);
user.get("/:id", userHandlers.findUser);
user.post("/",middleWares.sentEmail, userHandlers.createUser);
user.delete("/:id", userHandlers.deleteUser);
user.put("/password/:id", userHandlers.changePassword);
user.put("/:id", userHandlers.updateUser);
user.post("/verifying/:id", userHandlers.verifying);
user.post("/sign-in", userHandlers.signIn);
user.post("/send-reset-mail", middleWares.sentResetPasswordEmail);
user.post("/reset-password/:token", userHandlers.resetPassword);

export default user;