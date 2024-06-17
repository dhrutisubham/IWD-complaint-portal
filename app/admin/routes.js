import { Router } from "express";
import { loginSchema } from "./schema.js";
import { validateBody } from "../middleware/validateBody.js";
import { login, logout } from "./service.js";
import validateAdmin from "../middleware/validateAdmin.js";


const adminRouter = Router();

adminRouter.post("/logout", logout);
adminRouter.get('/login',validateAdmin(), (req,resp) => {
    return resp.status(200).json({
        success: true,
        message: 'Login successful',
    });
})
adminRouter.post("/login", validateBody(loginSchema), login)

export default adminRouter;