import { Router } from "express";
import { createComplaint, getComplaints } from "./service.js";
import { validateBody } from "../middleware/validateBody.js";
import { createComplaintSchema } from "./schema.js";
import validateAdmin from "../middleware/validateAdmin.js";

const complaintRouter = Router();

// :TODO: add admin auth
complaintRouter.get("",validateAdmin(), getComplaints);
complaintRouter.post("", validateBody(createComplaintSchema), createComplaint)

export default complaintRouter;