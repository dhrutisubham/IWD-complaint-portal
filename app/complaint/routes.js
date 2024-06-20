import { Router } from "express";
import validateAdmin from "../middleware/validateAdmin.js";
import { changeStatus, createComplaint, getComplaints, getComplaintsByID } from "./service.js";
import { validateBody } from "../middleware/validateBody.js";
import { changeComplaintStatusSchema } from "./schema.js";
const complaintRouter = Router();

complaintRouter.get("", getComplaints);
complaintRouter.get("/:id",getComplaintsByID);
complaintRouter.post("", createComplaint);
complaintRouter.patch("/:id/change-status",validateAdmin(), validateBody(changeComplaintStatusSchema), changeStatus);

export default complaintRouter;