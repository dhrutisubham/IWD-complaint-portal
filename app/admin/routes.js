import { Router } from "express";
import { loginSchema } from "./schema.js";
import { validateBody } from "../middleware/validateBody.js";
import { login, logout } from "./service.js";


const adminRouter = Router();

adminRouter.post("/logout", logout);
adminRouter.post("/login", validateBody(loginSchema), login)

export default adminRouter;